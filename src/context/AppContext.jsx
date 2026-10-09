'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_CREATORS,
  INITIAL_CAMPAIGNS,
  INITIAL_COLLABORATION_REQUESTS,
  INITIAL_PROJECTS,
  INITIAL_CONVERSATIONS,
  INITIAL_EVIDENCE_RECORDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_BRAND_PROFILE
} from '../data/mockData';
import { createClient } from '@/lib/supabase/client';

const AppContext = createContext(null);

// SSR-safe storage helpers
const getStorageString = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch {
    return fallback;
  }
};

const getStorageJson = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

let cachedSupabase = null;
const getSupabaseClient = () => {
  if (!cachedSupabase && typeof window !== 'undefined') {
    try {
      cachedSupabase = createClient();
    } catch (e) {
      console.warn('Supabase client initialization skipped:', e);
    }
  }
  return cachedSupabase;
};

export const AppProvider = ({ children }) => {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState(() => getStorageString('cp_role_v3', 'brand'));
  const [currentPage, setCurrentPage] = useState(() => getStorageString('cp_page_v3', 'brand-dashboard'));

  // Selected Entities for Detail Views
  const [selectedCreatorId, setSelectedCreatorId] = useState('creator-1');
  const [selectedCampaignId, setSelectedCampaignId] = useState('camp-1');
  const [selectedProjectId, setSelectedProjectId] = useState('proj-101');
  const [selectedConversationId, setSelectedConversationId] = useState('conv-1');

  // Shortlist State
  const [shortlistedCreatorIds, setShortlistedCreatorIds] = useState(['creator-1', 'creator-4']);

  // Dynamic Data Stores with local storage fallback
  const [creators, setCreators] = useState(() => getStorageJson('cp_creators_v3', INITIAL_CREATORS));
  const [campaigns, setCampaigns] = useState(() => getStorageJson('cp_campaigns_v3', INITIAL_CAMPAIGNS));
  const [collaborationRequests, setCollaborationRequests] = useState(() => getStorageJson('cp_requests_v3', INITIAL_COLLABORATION_REQUESTS));
  const [projects, setProjects] = useState(() => getStorageJson('cp_projects_v3', INITIAL_PROJECTS));
  const [conversations, setConversations] = useState(() => getStorageJson('cp_conversations_v3', INITIAL_CONVERSATIONS));
  const [evidenceRecords, setEvidenceRecords] = useState(() => getStorageJson('cp_evidence_v3', INITIAL_EVIDENCE_RECORDS));
  const [notifications, setNotifications] = useState(() => getStorageJson('cp_notifications_v3', INITIAL_NOTIFICATIONS));
  const [brandProfile, setBrandProfile] = useState(() => getStorageJson('cp_brand_profile_v3', INITIAL_BRAND_PROFILE));
  const [activeCreatorProfile, setActiveCreatorProfile] = useState(INITIAL_CREATORS[0]);

  // Auth User & Profile from live Supabase
  const [authUser, setAuthUser] = useState(null);
  const [authProfile, setAuthProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  // Toast Dispatcher
  const addToast = useCallback(({ title, message, type = 'success' }) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync with localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_role_v3', currentRole);
    }
  }, [currentRole]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_page_v3', currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_campaigns_v3', JSON.stringify(campaigns));
    }
  }, [campaigns]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_requests_v3', JSON.stringify(collaborationRequests));
    }
  }, [collaborationRequests]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_projects_v3', JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_conversations_v3', JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cp_evidence_v3', JSON.stringify(evidenceRecords));
    }
  }, [evidenceRecords]);

  // Supabase Auth and Session Hydration
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    let isMounted = true;

    async function hydrateUser() {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr || !user) {
          if (isMounted) {
            setAuthUser(null);
            setAuthProfile(null);
            setAuthLoading(false);
          }
          return;
        }

        if (!isMounted) return;
        setAuthUser(user);

        // Fetch user profile from PostgreSQL
        let { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        // If user is authenticated but profile row is missing (e.g. freshly confirmed email), initialize safely
        if (!profile && user) {
          const userRole = (user.user_metadata?.role) || 'creator';
          const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

          const { data: newProfile, error: createProfileErr } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              email: user.email,
              display_name: displayName,
              role: userRole === 'admin' ? 'creator' : userRole
            })
            .select()
            .maybeSingle();

          if (createProfileErr) {
            console.warn('Profile initialization notice:', createProfileErr.message);
          } else {
            profile = newProfile;
            if (userRole === 'creator') {
              const handle = (user.email?.split('@')[0] || 'creator').toLowerCase().replace(/[^a-z0-9_]/g, '_');
              await supabase.from('creator_profiles').insert({
                profile_id: user.id,
                handle: `${handle}_${user.id.slice(0, 4)}`,
                specialization: user.user_metadata?.specialization || 'AI Visual Production',
                availability: 'available',
                is_verified: false
              });
            } else if (userRole === 'brand') {
              await supabase.from('brand_profiles').insert({
                profile_id: user.id,
                company_name: user.user_metadata?.company_name || displayName,
                billing_email: user.email,
                is_verified: false
              });
            }
          }
        }

        if (profile && isMounted) {
          setAuthProfile(profile);
          // Strictly bind current role to stored profile role
          setCurrentRole(profile.role);

          if (profile.role === 'brand') {
            const { data: bProfile } = await supabase
              .from('brand_profiles')
              .select('*')
              .eq('profile_id', user.id)
              .maybeSingle();

            if (bProfile && isMounted) {
              setBrandProfile((prev) => ({
                ...prev,
                name: bProfile.company_name || prev.name,
                company: bProfile.company_name || prev.company,
                website: bProfile.website || prev.website,
                industry: bProfile.industry || prev.industry,
                companySize: bProfile.company_size || prev.companySize
              }));

              // Fetch existing briefs belonging to this brand
              const { data: userBriefs } = await supabase
                .from('briefs')
                .select('*')
                .eq('brand_profile_id', bProfile.id)
                .order('created_at', { ascending: false });

              if (userBriefs && userBriefs.length > 0 && isMounted) {
                const mappedBriefs = userBriefs.map((b) => ({
                  id: b.id,
                  title: b.title,
                  category: b.content_type || 'AI Visual Production',
                  brandName: bProfile.company_name,
                  brandLogo: INITIAL_BRAND_PROFILE.logo,
                  budget: Number(b.budget) || 0,
                  deliverables: [b.description],
                  status: b.status === 'published' ? 'Active' : 'Draft',
                  deadline: b.deadline ? new Date(b.deadline).toLocaleDateString() : 'TBD',
                  description: b.description,
                  applicantsCount: 0,
                  matchesCount: 0,
                  topMatches: []
                }));
                setCampaigns((prev) => {
                  const existingIds = new Set(mappedBriefs.map((mb) => mb.id));
                  return [...mappedBriefs, ...prev.filter((p) => !existingIds.has(p.id))];
                });
              }
            }
          } else if (profile.role === 'creator') {
            const { data: cProfile } = await supabase
              .from('creator_profiles')
              .select('*, portfolio_projects(*)')
              .eq('profile_id', user.id)
              .maybeSingle();

            if (cProfile && isMounted) {
              setActiveCreatorProfile((prev) => ({
                ...prev,
                id: cProfile.id,
                name: profile.display_name || prev.name,
                handle: cProfile.handle || prev.handle,
                bio: cProfile.bio || prev.bio,
                tagline: cProfile.tagline || prev.tagline,
                primarySpecialization: cProfile.specialization || prev.primarySpecialization,
                hourlyRate: cProfile.hourly_rate ? `$${cProfile.hourly_rate}/hr` : prev.hourlyRate,
                proofScore: cProfile.proof_score ?? prev.proofScore,
                verified: cProfile.is_verified,
                portfolio: cProfile.portfolio_projects?.length
                  ? cProfile.portfolio_projects.map((p) => ({
                      id: p.id,
                      title: p.title,
                      category: p.content_type,
                      description: p.description,
                      tools: p.models_used || [],
                      workflow: p.workflow_description
                    }))
                  : prev.portfolio
              }));
            }
          }
        }
      } catch (err) {
        console.warn('Session hydration notice:', err);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    }

    hydrateUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setAuthUser(session?.user || null);
      if (!session?.user) {
        setAuthProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Navigation Helper with Role Protection
  const navigateTo = (page, options = {}) => {
    if (options.creatorId) setSelectedCreatorId(options.creatorId);
    if (options.campaignId) setSelectedCampaignId(options.campaignId);
    if (options.projectId) setSelectedProjectId(options.projectId);
    if (options.conversationId) setSelectedConversationId(options.conversationId);

    const publicPages = ['landing', 'directory', 'creator-detail', 'how-it-works', 'auth'];
    const brandPages = [
      'brand-dashboard', 'brand-profile', 'my-campaigns', 'create-campaign',
      'ai-brief-builder', 'explore-creators', 'brand-creator-detail',
      'shortlist-compare', 'brand-requests', 'brand-projects',
      'brand-notifications', 'brand-settings'
    ];
    const creatorPages = [
      'creator-dashboard', 'creator-profile', 'my-creator-profile', 'portfolio-manager',
      'evidence-verification', 'available-campaigns', 'creator-campaign-detail',
      'submit-proposal', 'creator-requests', 'creator-projects',
      'creator-notifications', 'creator-settings', 'public-profile-preview'
    ];

    // Enforce role isolation for authenticated users
    if (authProfile) {
      if (authProfile.role === 'creator' && brandPages.includes(page)) {
        addToast({
          title: 'Access Restricted',
          message: 'Creator accounts cannot access Brand Workspace pages.',
          type: 'danger'
        });
        setCurrentPage('creator-dashboard');
        return;
      }
      if (authProfile.role === 'brand' && creatorPages.includes(page)) {
        addToast({
          title: 'Access Restricted',
          message: 'Brand accounts cannot access Creator Studio pages.',
          type: 'danger'
        });
        setCurrentPage('brand-dashboard');
        return;
      }
    }

    if (publicPages.includes(page)) {
      setCurrentRole('public');
    } else if (brandPages.includes(page)) {
      setCurrentRole('brand');
    } else if (creatorPages.includes(page)) {
      setCurrentRole('creator');
    }

    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Switch Role with Security Isolation
  const switchRole = (newRole) => {
    if (authProfile && newRole !== 'public' && newRole !== authProfile.role) {
      addToast({
        title: 'Access Restricted',
        message: `Your account is registered as a ${authProfile.role}. You cannot switch to ${newRole} workspace.`,
        type: 'danger'
      });
      return;
    }

    setCurrentRole(newRole);
    if (newRole === 'public') {
      setCurrentPage('landing');
    } else if (newRole === 'brand') {
      setCurrentPage('brand-dashboard');
    } else if (newRole === 'creator') {
      setCurrentPage('creator-dashboard');
    }
  };

  // Sign out / Logout (Clears all private user state)
  const logout = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setAuthUser(null);
    setAuthProfile(null);

    // Clear local storage session tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cp_role_v3');
      localStorage.removeItem('cp_page_v3');
    }

    setCurrentRole('public');
    setCurrentPage('landing');
    addToast({
      title: 'Signed Out',
      message: 'You have been safely signed out. Private session cleared.',
      type: 'info'
    });
  };

  // Shortlist Toggles
  const toggleShortlist = (creatorId) => {
    setShortlistedCreatorIds((prev) => {
      const exists = prev.includes(creatorId);
      const updated = exists ? prev.filter((id) => id !== creatorId) : [...prev, creatorId];
      const creator = creators.find((c) => c.id === creatorId);
      addToast({
        title: exists ? 'Removed from Shortlist' : 'Added to Shortlist',
        message: `${creator?.name || 'Creator'} has been ${exists ? 'removed from' : 'saved to'} your shortlist.`,
        type: exists ? 'info' : 'success'
      });
      return updated;
    });
  };

  // Saved Opportunities (for Creators)
  const [savedOpportunityIds, setSavedOpportunityIds] = useState(['camp-1', 'camp-2']);
  const toggleSaveOpportunity = (campId) => {
    setSavedOpportunityIds((prev) => {
      const exists = prev.includes(campId);
      const updated = exists ? prev.filter((id) => id !== campId) : [...prev, campId];
      const camp = campaigns.find((c) => c.id === campId);
      addToast({
        title: exists ? 'Opportunity Removed' : 'Opportunity Saved!',
        message: `${camp?.title || 'Campaign'} has been ${exists ? 'removed from' : 'saved to'} your tracked opportunities.`,
        type: exists ? 'info' : 'success'
      });
      return updated;
    });
  };

  // Campaign Actions (with Confirmed Supabase briefs table persistence)
  const addCampaign = async (newCampaign) => {
    const isDraft = newCampaign.status === 'Draft';
    const supabase = getSupabaseClient();

    // 1. Authenticated Flow: Require Confirmed Database Insertion
    if (supabase && authUser) {
      try {
        const { data: bProfile, error: bProfileErr } = await supabase
          .from('brand_profiles')
          .select('id')
          .eq('profile_id', authUser.id)
          .maybeSingle();

        if (bProfileErr || !bProfile) {
          addToast({
            title: 'Brand Profile Required',
            message: 'An active brand profile is required to publish briefs.',
            type: 'danger'
          });
          return null;
        }

        const { data: savedBrief, error: insertErr } = await supabase
          .from('briefs')
          .insert({
            brand_profile_id: bProfile.id,
            title: newCampaign.title,
            description: newCampaign.description || newCampaign.overview || newCampaign.title,
            content_type: newCampaign.contentType || 'image',
            budget: Number(newCampaign.budget) || null,
            deadline: newCampaign.deadline
              ? new Date(newCampaign.deadline).toISOString()
              : new Date(Date.now() + 14 * 86400000).toISOString(),
            status: isDraft ? 'draft' : 'published'
          })
          .select()
          .single();

        if (insertErr) {
          addToast({
            title: 'Failed to Save Campaign',
            message: insertErr.message,
            type: 'danger'
          });
          return null;
        }

        const camp = {
          ...newCampaign,
          id: savedBrief.id,
          brandId: bProfile.id,
          brandName: brandProfile.name,
          brandLogo: brandProfile.logo,
          status: isDraft ? 'Draft' : 'Active',
          createdAt: new Date().toISOString().split('T')[0],
          applicantsCount: 0,
          matchesCount: 8,
          topMatches: []
        };
        setCampaigns((prev) => [camp, ...prev]);

        addToast({
          title: isDraft ? 'Draft Brief Saved' : 'Campaign Published Successfully!',
          message: `"${camp.title}" persisted to PostgreSQL database.`,
          type: isDraft ? 'info' : 'success'
        });
        return savedBrief.id;
      } catch (err) {
        addToast({
          title: 'Database Error',
          message: 'Unable to reach the database server.',
          type: 'danger'
        });
        return null;
      }
    }

    // 2. Unauthenticated Demo Fallback: Explicitly Marked as Demo
    const campId = `camp-${Date.now()}`;
    const camp = {
      ...newCampaign,
      id: campId,
      brandId: 'brand-demo',
      brandName: brandProfile.name,
      brandLogo: brandProfile.logo,
      status: newCampaign.status || 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
      matchesCount: 8,
      topMatches: [
        { creatorId: 'creator-1', score: 98, reason: 'High match on required tools and creative category.' },
        { creatorId: 'creator-4', score: 93, reason: 'Strong social format delivery metrics.' }
      ]
    };
    setCampaigns((prev) => [camp, ...prev]);

    addToast({
      title: isDraft ? 'Draft Saved (Demo Mode)' : 'Campaign Published (Demo Mode)',
      message: `"${camp.title}" saved locally. Sign in to persist to live database.`,
      type: 'info'
    });
    return camp.id;
  };

  const updateCampaign = (campaignId, updatedFields) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, ...updatedFields } : c))
    );
    addToast({
      title: 'Campaign Updated',
      message: 'Your campaign changes have been saved.',
      type: 'success'
    });
  };

  const duplicateCampaign = (campaignId) => {
    const original = campaigns.find((c) => c.id === campaignId);
    if (!original) return;
    const duplicated = {
      ...original,
      id: `camp-${Date.now()}`,
      title: `${original.title} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      applicantsCount: 0
    };
    setCampaigns((prev) => [duplicated, ...prev]);
    addToast({
      title: 'Campaign Duplicated',
      message: `Created draft copy: "${duplicated.title}".`,
      type: 'info'
    });
  };

  const toggleCampaignStatus = (campaignId, newStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: newStatus } : c))
    );
    addToast({
      title: `Campaign ${newStatus}`,
      message: `Campaign status changed to ${newStatus}.`,
      type: 'info'
    });
  };

  // Collaboration Request Actions
  const sendCollaborationRequest = ({ campaignId, creatorId, budget, deliverables, deadline, message }) => {
    const creator = creators.find((c) => c.id === creatorId);
    const campaign = campaigns.find((c) => c.id === campaignId) || campaigns[0];

    const newReq = {
      id: `req-${Date.now()}`,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
      brandName: brandProfile.name,
      brandLogo: brandProfile.logo,
      creatorId: creator ? creator.id : 'creator-1',
      creatorName: creator ? creator.name : 'AI Creator',
      creatorAvatar: creator ? creator.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      type: 'Brand Invitation',
      status: 'Sent',
      budget: Number(budget) || campaign.budget,
      counterBudget: null,
      deliverables: deliverables || (campaign.deliverables ? campaign.deliverables.join(', ') : 'Creative deliverables'),
      deadline: deadline || campaign.deadline,
      sentDate: new Date().toISOString().split('T')[0],
      message: message || "We'd love to collaborate on this campaign!",
      projectId: null
    };

    setCollaborationRequests((prev) => [newReq, ...prev]);
    addToast({
      title: 'Collaboration Invitation Sent!',
      message: `Invitation sent to ${creator?.name || 'Creator'} for $${newReq.budget}.`,
      type: 'success'
    });
  };

  // Creator Proposal Submission (with Confirmed Database Insertion)
  const submitProposal = async ({ campaignId, pitch, proposedBudget, timeline, portfolioItems, message }) => {
    const campaign = campaigns.find((c) => c.id === campaignId);
    const supabase = getSupabaseClient();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(campaignId);

    // 1. Authenticated Flow with Valid Brief ID
    if (supabase && authUser && isUuid) {
      try {
        const { data: cProfile, error: cErr } = await supabase
          .from('creator_profiles')
          .select('id')
          .eq('profile_id', authUser.id)
          .maybeSingle();

        if (cErr || !cProfile) {
          addToast({
            title: 'Creator Profile Required',
            message: 'You need an active creator profile to submit proposals.',
            type: 'danger'
          });
          return;
        }

        const { data: savedProposal, error: propErr } = await supabase
          .from('proposals')
          .insert({
            brief_id: campaignId,
            creator_profile_id: cProfile.id,
            pitch: pitch || message || 'Deliverables with verified AI generation provenance',
            proposed_budget: Number(proposedBudget) || 1000,
            estimated_delivery_days: 7,
            status: 'submitted'
          })
          .select()
          .single();

        if (propErr) {
          addToast({
            title: 'Proposal Submission Failed',
            message: propErr.message,
            type: 'danger'
          });
          return;
        }

        const newReq = {
          id: savedProposal.id,
          campaignId,
          campaignTitle: campaign ? campaign.title : 'Custom Campaign',
          brandName: campaign ? campaign.brandName : 'Brand Client',
          brandLogo: campaign ? campaign.brandLogo : INITIAL_BRAND_PROFILE.logo,
          creatorId: cProfile.id,
          creatorName: activeCreatorProfile.name,
          creatorAvatar: activeCreatorProfile.avatar,
          type: 'Creator Proposal',
          status: 'Sent',
          budget: Number(proposedBudget) || 3500,
          counterBudget: null,
          deliverables: pitch || 'Custom AI visual deliverables with source files',
          deadline: timeline || '2 Weeks',
          sentDate: new Date().toISOString().split('T')[0],
          message: message || pitch,
          projectId: null
        };
        setCollaborationRequests((prev) => [newReq, ...prev]);

        addToast({
          title: 'Proposal Submitted Successfully!',
          message: `Your proposal for "${newReq.campaignTitle}" persisted to database.`,
          type: 'success'
        });
        return;
      } catch (err) {
        addToast({
          title: 'Submission Error',
          message: 'Unable to communicate with proposal backend.',
          type: 'danger'
        });
        return;
      }
    }

    // 2. Demo Brief / Unauthenticated Flow
    const newReq = {
      id: `req-${Date.now()}`,
      campaignId: campaign ? campaign.id : 'camp-1',
      campaignTitle: campaign ? campaign.title : 'Custom Campaign',
      brandName: campaign ? campaign.brandName : 'Brand Client',
      brandLogo: campaign ? campaign.brandLogo : INITIAL_BRAND_PROFILE.logo,
      creatorId: activeCreatorProfile.id,
      creatorName: activeCreatorProfile.name,
      creatorAvatar: activeCreatorProfile.avatar,
      type: 'Creator Proposal',
      status: 'Sent',
      budget: Number(proposedBudget) || 3500,
      counterBudget: null,
      deliverables: pitch || 'Custom AI visual deliverables with source files',
      deadline: timeline || '2 Weeks',
      sentDate: new Date().toISOString().split('T')[0],
      message: message || pitch,
      projectId: null
    };
    setCollaborationRequests((prev) => [newReq, ...prev]);

    addToast({
      title: 'Proposal Recorded (Demo Mode)',
      message: `Your proposal for "${newReq.campaignTitle}" recorded in local preview.`,
      type: 'info'
    });
  };

  const respondToRequest = (requestId, responseAction, customData = {}) => {
    setCollaborationRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        if (responseAction === 'Accept') {
          const newProjectId = `proj-${Date.now()}`;
          const newProject = {
            id: newProjectId,
            title: req.campaignTitle,
            campaignId: req.campaignId,
            brandName: req.brandName,
            brandLogo: req.brandLogo,
            creatorId: req.creatorId,
            creatorName: req.creatorName,
            creatorAvatar: req.creatorAvatar,
            status: 'In Progress',
            budgetTotal: req.counterBudget || req.budget,
            escrowLocked: req.counterBudget || req.budget,
            escrowReleased: 0,
            startDate: new Date().toISOString().split('T')[0],
            targetDeadline: req.deadline,
            progressPercent: 15,
            milestones: [
              {
                id: `m-${Date.now()}-1`,
                title: 'Milestone 1: Preliminary Generation & Styleframes',
                payout: Math.round((req.counterBudget || req.budget) * 0.4),
                status: 'In Progress',
                dueDate: 'In 7 Days',
                deliverableFiles: [],
                feedback: null
              },
              {
                id: `m-${Date.now()}-2`,
                title: 'Milestone 2: Final High-Res Deliverables & Source Files',
                payout: Math.round((req.counterBudget || req.budget) * 0.6),
                status: 'Not Started',
                dueDate: req.deadline,
                deliverableFiles: [],
                feedback: null
              }
            ],
            taskChecklist: [
              { id: 't-init-1', text: 'Confirm brand tone and reference prompt parameters', done: true },
              { id: 't-init-2', text: 'Generate draft styleframes for review', done: false },
              { id: 't-init-3', text: 'Render final deliverables at 4K resolution', done: false }
            ],
            deliverableVersions: []
          };

          setProjects((pList) => [newProject, ...pList]);
          return { ...req, status: 'Accepted', projectId: newProjectId };
        } else if (responseAction === 'Decline') {
          return { ...req, status: 'Declined' };
        } else if (responseAction === 'Counteroffer') {
          return {
            ...req,
            status: 'Counteroffer',
            counterBudget: customData.counterBudget || req.budget * 1.15,
            counterNotes: customData.counterNotes || 'Proposed scope adjustment with expedited timeline.'
          };
        } else if (responseAction === 'Withdraw') {
          return { ...req, status: 'Declined' };
        }
        return req;
      })
    );

    addToast({
      title: `Collaboration Request ${responseAction}ed`,
      message: `Request update has been recorded and participants notified.`,
      type: responseAction === 'Accept' ? 'success' : 'info'
    });
  };

  // Chat Actions
  const sendMessage = (conversationId, messageText, attachment = null) => {
    if (!messageText && !attachment) return;

    const senderRole = currentRole === 'brand' ? 'brand' : 'creator';
    const senderName = senderRole === 'brand' ? brandProfile.name : activeCreatorProfile.name;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderRole,
      senderName,
      timestamp: 'Just now',
      text: messageText,
      attachment
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: messageText || 'Sent an attachment',
            lastTimestamp: 'Just now',
            messages: [...conv.messages, newMsg]
          };
        }
        return conv;
      })
    );

    if (senderRole === 'brand') {
      setTimeout(() => {
        const autoReply = {
          id: `msg-auto-${Date.now()}`,
          senderRole: 'creator',
          senderName: 'Elena Rostova',
          timestamp: 'Just now',
          text: "Thanks for the feedback! I'm updating the ComfyUI workflow parameters right now and will push the new render shortly.",
          attachment: null
        };
        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                lastMessage: autoReply.text,
                lastTimestamp: 'Just now',
                messages: [...conv.messages, autoReply]
              };
            }
            return conv;
          })
        );
      }, 3500);
    }
  };

  // Project Actions
  const uploadDeliverableVersion = (projectId, milestoneId, { title, notes, fileName, previewImage }) => {
    const newVersionObj = {
      version: `v${(Math.random() * 0.9 + 1.1).toFixed(1)}`,
      uploadedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: title || 'Updated Deliverable Package',
      notes: notes || 'High-res renders and audited generation seeds.',
      downloadUrl: '#',
      previewImage: previewImage || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      status: 'Submitted'
    };

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedMilestones = p.milestones.map((m) => {
          if (m.id === milestoneId) {
            return {
              ...m,
              status: 'Submitted',
              deliverableFiles: [
                ...m.deliverableFiles,
                { name: fileName || 'Deliverable_Package.zip', size: '210 MB', uploadedAt: 'Today' }
              ]
            };
          }
          return m;
        });

        return {
          ...p,
          status: 'Submitted',
          milestones: updatedMilestones,
          deliverableVersions: [newVersionObj, ...p.deliverableVersions]
        };
      })
    );

    addToast({
      title: 'Deliverable Version Uploaded!',
      message: 'Brand has been notified to review the new milestone submission.',
      type: 'success'
    });
  };

  const approveMilestone = (projectId, milestoneId) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        let releasedAmount = 0;
        const updatedMilestones = p.milestones.map((m) => {
          if (m.id === milestoneId) {
            releasedAmount = m.payout;
            return {
              ...m,
              status: 'Approved',
              feedback: 'Approved by Brand: Milestone released successfully.'
            };
          }
          return m;
        });

        const allApproved = updatedMilestones.every((m) => m.status === 'Approved');

        return {
          ...p,
          status: allApproved ? 'Completed' : 'In Progress',
          escrowReleased: p.escrowReleased + releasedAmount,
          progressPercent: allApproved ? 100 : Math.min(95, p.progressPercent + 30),
          milestones: updatedMilestones
        };
      })
    );

    addToast({
      title: 'Milestone Approved & Escrow Released!',
      message: 'Payment has been successfully transferred to the creator.',
      type: 'success'
    });
  };

  const requestProjectRevision = (projectId, milestoneId, feedbackText) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedMilestones = p.milestones.map((m) => {
          if (m.id === milestoneId) {
            return {
              ...m,
              status: 'Revision Requested',
              feedback: feedbackText || 'Please adjust color grading and lighting reflections.'
            };
          }
          return m;
        });

        return {
          ...p,
          status: 'Revision Requested',
          milestones: updatedMilestones
        };
      })
    );

    addToast({
      title: 'Revision Request Sent',
      message: 'Creator has received your notes and is preparing a revised version.',
      type: 'info'
    });
  };

  // Evidence Actions
  const submitEvidence = ({ claimTitle, category, claimDescription, evidenceUrl, evidenceType }) => {
    const newEv = {
      id: `ev-${Date.now()}`,
      creatorId: activeCreatorProfile.id,
      claimTitle,
      category: category || 'Tool Mastery',
      claimDescription,
      evidenceUrl,
      evidenceType: evidenceType || 'Audited External Link',
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'under-review',
      verifierNotes: 'Verification submission queued for automated artifact inspection and human review.',
      hash: null
    };

    setEvidenceRecords((prev) => [newEv, ...prev]);
    addToast({
      title: 'Evidence Submitted for Review',
      message: 'Your claim has been submitted to the verification audit queue.',
      type: 'success'
    });
  };

  // Portfolio Actions (with Confirmed Database Insertion)
  const addPortfolioItem = async (newItem) => {
    const supabase = getSupabaseClient();

    // 1. Authenticated Flow
    if (supabase && authUser) {
      try {
        const { data: cProfile, error: cErr } = await supabase
          .from('creator_profiles')
          .select('id')
          .eq('profile_id', authUser.id)
          .maybeSingle();

        if (cErr || !cProfile) {
          addToast({
            title: 'Creator Profile Required',
            message: 'You need an active creator profile to add portfolio pieces.',
            type: 'danger'
          });
          return;
        }

        const slug = (newItem.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const { data: savedProject, error: insertErr } = await supabase
          .from('portfolio_projects')
          .insert({
            creator_profile_id: cProfile.id,
            title: newItem.title || 'Untitled Project',
            slug,
            description: newItem.description || null,
            content_type: newItem.category || 'image',
            workflow_description: newItem.workflow || null,
            models_used: Array.isArray(newItem.tools) ? newItem.tools : [],
            is_public: true
          })
          .select()
          .single();

        if (insertErr) {
          addToast({
            title: 'Failed to Add Portfolio Project',
            message: insertErr.message,
            type: 'danger'
          });
          return;
        }

        const item = {
          ...newItem,
          id: savedProject.id
        };

        setActiveCreatorProfile((prev) => ({
          ...prev,
          portfolio: [item, ...prev.portfolio]
        }));

        setCreators((prev) =>
          prev.map((c) =>
            c.id === activeCreatorProfile.id
              ? { ...c, portfolio: [item, ...c.portfolio] }
              : c
          )
        );

        addToast({
          title: 'Portfolio Project Added',
          message: `"${item.title}" saved and live on your public creator profile.`,
          type: 'success'
        });
        return;
      } catch (err) {
        addToast({
          title: 'Database Error',
          message: 'Unable to communicate with portfolio database.',
          type: 'danger'
        });
        return;
      }
    }

    // 2. Demo Mode Fallback
    const item = {
      ...newItem,
      id: `port-${Date.now()}`
    };

    setActiveCreatorProfile((prev) => ({
      ...prev,
      portfolio: [item, ...prev.portfolio]
    }));

    setCreators((prev) =>
      prev.map((c) =>
        c.id === activeCreatorProfile.id
          ? { ...c, portfolio: [item, ...c.portfolio] }
          : c
      )
    );

    addToast({
      title: 'Portfolio Item Added (Demo Mode)',
      message: `"${item.title}" added to local preview. Sign in to save to live portfolio.`,
      type: 'info'
    });
  };

  const deletePortfolioItem = (portfolioId) => {
    setActiveCreatorProfile((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((p) => p.id !== portfolioId)
    }));

    setCreators((prev) =>
      prev.map((c) =>
        c.id === activeCreatorProfile.id
          ? { ...c, portfolio: c.portfolio.filter((p) => p.id !== portfolioId) }
          : c
      )
    );

    addToast({
      title: 'Portfolio Project Removed',
      message: 'Item has been deleted from your portfolio.',
      type: 'info'
    });
  };

  // Profile Updates (with Strict Database Row Confirmation)
  const updateBrandProfile = async (fields) => {
    const supabase = getSupabaseClient();

    if (supabase && authUser) {
      try {
        const { data, error } = await supabase
          .from('brand_profiles')
          .update({
            company_name: fields.name || fields.company,
            website: fields.website,
            industry: fields.industry,
            company_size: fields.companySize
          })
          .eq('profile_id', authUser.id)
          .select();

        if (error) {
          addToast({
            title: 'Failed to Save Brand Profile',
            message: error.message,
            type: 'danger'
          });
          return;
        }

        if (!data || data.length === 0) {
          addToast({
            title: 'Update Ineffective',
            message: 'No matching brand profile row found for this account.',
            type: 'danger'
          });
          return;
        }

        setBrandProfile((prev) => ({ ...prev, ...fields }));
        addToast({
          title: 'Brand Profile Updated',
          message: 'Company profile and preferences successfully saved to database.',
          type: 'success'
        });
        return;
      } catch (err) {
        addToast({
          title: 'Database Error',
          message: 'Could not connect to update brand profile.',
          type: 'danger'
        });
        return;
      }
    }

    setBrandProfile((prev) => ({ ...prev, ...fields }));
    addToast({
      title: 'Brand Profile Updated (Demo Mode)',
      message: 'Company profile saved in local memory.',
      type: 'info'
    });
  };

  const updateCreatorProfile = async (fields) => {
    const supabase = getSupabaseClient();

    if (supabase && authUser) {
      try {
        const { data, error } = await supabase
          .from('creator_profiles')
          .update({
            tagline: fields.tagline,
            bio: fields.bio,
            specialization: fields.primarySpecialization || fields.specialization,
            hourly_rate: fields.hourlyRate ? parseFloat(String(fields.hourlyRate).replace(/[^0-9.]/g, '')) : undefined
          })
          .eq('profile_id', authUser.id)
          .select();

        if (error) {
          addToast({
            title: 'Failed to Save Creator Profile',
            message: error.message,
            type: 'danger'
          });
          return;
        }

        if (!data || data.length === 0) {
          addToast({
            title: 'Update Ineffective',
            message: 'No matching creator profile row found for this account.',
            type: 'danger'
          });
          return;
        }

        setActiveCreatorProfile((prev) => ({ ...prev, ...fields }));
        setCreators((prev) =>
          prev.map((c) => (c.id === activeCreatorProfile.id ? { ...c, ...fields } : c))
        );
        addToast({
          title: 'Creator Profile Updated',
          message: 'Your profile changes were persisted to PostgreSQL.',
          type: 'success'
        });
        return;
      } catch (err) {
        addToast({
          title: 'Database Error',
          message: 'Could not connect to update creator profile.',
          type: 'danger'
        });
        return;
      }
    }

    setActiveCreatorProfile((prev) => ({ ...prev, ...fields }));
    setCreators((prev) =>
      prev.map((c) => (c.id === activeCreatorProfile.id ? { ...c, ...fields } : c))
    );
    addToast({
      title: 'Creator Profile Updated (Demo Mode)',
      message: 'Your profile changes saved in local memory.',
      type: 'info'
    });
  };

  // Notification actions
  const addNotification = (role, notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
      ...notif
    };
    setNotifications((prev) => ({
      ...prev,
      [role]: [newNotif, ...(prev[role] || [])]
    }));
  };

  const markNotificationRead = (role, notifId) => {
    setNotifications((prev) => ({
      ...prev,
      [role]: prev[role].map((n) => (n.id === notifId ? { ...n, read: true } : n))
    }));
  };

  const markNotificationAsRead = markNotificationRead;

  const markAllNotificationsRead = (role) => {
    setNotifications((prev) => ({
      ...prev,
      [role]: prev[role].map((n) => ({ ...n, read: true }))
    }));
    addToast({
      title: 'All Notifications Marked as Read',
      message: 'Your inbox is up to date.',
      type: 'info'
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        currentPage,
        switchRole,
        navigateTo,
        selectedCreatorId,
        setSelectedCreatorId,
        selectedCampaignId,
        setSelectedCampaignId,
        selectedProjectId,
        setSelectedProjectId,
        selectedConversationId,
        setSelectedConversationId,
        shortlistedCreatorIds,
        toggleShortlist,
        creators,
        campaigns,
        collaborationRequests,
        projects,
        conversations,
        evidenceRecords,
        notifications,
        addNotification,
        brandProfile,
        activeCreatorProfile,
        authUser,
        authProfile,
        authLoading,
        logout,
        toasts,
        addToast,
        removeToast,
        addCampaign,
        updateCampaign,
        duplicateCampaign,
        toggleCampaignStatus,
        sendCollaborationRequest,
        submitProposal,
        respondToRequest,
        sendMessage,
        uploadDeliverableVersion,
        approveMilestone,
        requestProjectRevision,
        submitEvidence,
        addPortfolioItem,
        deletePortfolioItem,
        savedOpportunityIds,
        toggleSaveOpportunity,
        updateBrandProfile,
        updateCreatorProfile,
        markNotificationRead,
        markNotificationAsRead,
        markAllNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
