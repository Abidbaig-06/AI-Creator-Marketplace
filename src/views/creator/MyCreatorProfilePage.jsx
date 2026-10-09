import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchScoreBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import confetti from 'canvas-confetti';
import {
  analyzePortfolioPiece,
  scoutBrandOpportunities,
  analyzeProfileCompleteness
} from '../../services/creatorOpportunityAgent';
import {
  User,
  Sparkles,
  Save,
  Eye,
  CheckCircle2,
  DollarSign,
  Layers,
  ShieldCheck,
  Briefcase,
  Plus,
  Trash2,
  ArrowRight,
  Check,
  Zap,
  Code2,
  RefreshCw,
  Image as ImageIcon,
  Send,
  Bookmark
} from 'lucide-react';

export const MyCreatorProfilePage = () => {
  const {
    activeCreatorProfile,
    updateCreatorProfile,
    creators,
    campaigns,
    addPortfolioItem,
    deletePortfolioItem,
    savedOpportunityIds = [],
    toggleSaveOpportunity,
    submitProposal,
    addNotification,
    addToast,
    navigateTo
  } = useApp();

  // -------------------------------------------------------------
  // SECTION NAVIGATION TABS
  // -------------------------------------------------------------
  const [activeTab, setActiveTab] = useState('profile');
  // 'profile' | 'tools' | 'portfolio' | 'intelligence' | 'improvement' | 'opportunities'

  // References for smooth scrolling
  const profileSectionRef = useRef(null);
  const toolsSectionRef = useRef(null);
  const portfolioSectionRef = useRef(null);
  const intelligenceSectionRef = useRef(null);
  const improvementSectionRef = useRef(null);
  const opportunitiesSectionRef = useRef(null);

  // -------------------------------------------------------------
  // FEATURE 1: CREATOR PROFILE STATE
  // -------------------------------------------------------------
  const [formData, setFormData] = useState({
    id: activeCreatorProfile.id || 'creator-1',
    name: activeCreatorProfile.name || 'Sophia Chan',
    handle: activeCreatorProfile.handle || '@sophiachan_ai',
    headline: activeCreatorProfile.headline || 'AI Filmmaker & Visual Artist | Photorealistic Product & Motion Specialist',
    bio: activeCreatorProfile.bio || 'Pioneering generative art director with 6+ years in high-end commercial VFX and luxury branding. Certified ComfyUI node architect specializing in photorealistic product visuals, fluid dynamics, and custom brand LoRAs.',
    category: activeCreatorProfile.category || 'Product Visuals',
    specialization: activeCreatorProfile.specialization || 'Luxury Product Renders & Hyper-real Commercials',
    location: activeCreatorProfile.location || 'San Francisco, CA, USA',
    email: activeCreatorProfile.email || 'sophia.chan@creatorproof.ai',
    website: 'https://sophiachan.design',
    twitter: '@sophiachan_ai',
    github: 'sophia-ai',
    avatar: activeCreatorProfile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: activeCreatorProfile.coverImage || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
    startingPrice: activeCreatorProfile.startingPrice || 1800,
    hourlyRate: activeCreatorProfile.hourlyRate || 145,
    availability: activeCreatorProfile.availability || 'Available (Immediate)',
    experienceYears: '6+ Years',
    preferredCategories: ['Luxury Product Renders', 'Commercial Video', 'Virtual Influencer', 'Automotive Ads'],
    tools: activeCreatorProfile.tools || ['Flux.1 Pro', 'ComfyUI', 'Midjourney v6.1', 'Runway Gen-3', 'Magnific AI', 'Topaz Video AI'],
    skills: activeCreatorProfile.skills || ['AI Filmmaking', 'Prompt Engineering', 'Custom LoRA Training', 'Temporal Coherence', 'Color Grading', '3D Product Visualization', 'Photorealism'],
    customLoras: [
      { name: 'Velora Luxury Mineral LoRA v2.4', baseModel: 'Flux.1 Pro', epochs: '3,000 steps', trigger: 'velora_mineral_style' },
      { name: 'Macro Liquid Dispersion LoRA v1.8', baseModel: 'SDXL / ComfyUI', epochs: '2,400 steps', trigger: 'macro_droplet_fx' }
    ],
    packages: [
      {
        id: 'pkg-1',
        title: 'Starter: 4K Keyframe Still Bundle',
        price: 850,
        timeline: '48 Hours',
        revisions: '2 Revisions',
        deliverables: ['3 High-Res 8K Photorealistic Product Stills', 'Full Commercial License', 'Raw Seed & Prompt Manifest']
      },
      {
        id: 'pkg-2',
        title: 'Standard: 15s Cinematic Motion Teaser',
        price: 1800,
        timeline: '4 Days',
        revisions: '3 Revisions',
        deliverables: ['15s 4K Generative Video (16:9 & 9:16)', 'Color Graded & Sound-Designed Master', 'C2PA Cryptographic Verification Certificate']
      },
      {
        id: 'pkg-3',
        title: 'Enterprise: Full 60s Commercial Campaign',
        price: 4500,
        timeline: '10 Days',
        revisions: 'Unlimited',
        deliverables: ['60s Multi-Scene Commercial Film', 'Custom Trained Brand LoRA Weights (.safetensors)', 'Full ComfyUI Node Graph Handover', 'Category Exclusivity Rights']
      }
    ],
    usageRights: 'Full Global Commercial Buyout Included with All Deliverables; Custom LoRA weights transfer upon final release',
    portfolio: activeCreatorProfile.portfolio || [
      {
        id: 'port-101',
        title: 'Velora Eau De Parfum Botanical Campaign',
        category: 'Product Visuals',
        mediaType: 'AI Video',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
        tools: ['Flux.1 Pro', 'ComfyUI', 'Runway Gen-3'],
        skills: ['Fluid Simulation', 'Photorealism', 'Macro Lighting'],
        creativeStyle: 'Cinematic',
        aspectRatio: '16:9',
        description: 'Cinematic 8K product showcase highlighting macro fluid dynamics, golden hour ambient lighting, and refraction textures.',
        workflowDetails: 'Custom ComfyUI node graph with 4K Magnific AI upscaling and temporal coherence pass.',
        commercialRights: 'Full Commercial Global Buyout Included',
        evidenceLink: 'https://github.com/sophia-ai/velora-workflow-audit',
        evidenceType: 'Verified Workflow Hash'
      },
      {
        id: 'port-102',
        title: 'Lumina Velvet Hydration Serum Launch',
        category: 'Product Visuals',
        mediaType: 'AI Images',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        tools: ['Flux.1 Pro', 'ComfyUI'],
        skills: ['3D Product Visualization', 'Photorealism'],
        creativeStyle: 'Photorealistic',
        aspectRatio: '4:5',
        description: 'Cosmetic bottle render with photorealistic water refraction and micro moisture droplets.',
        workflowDetails: 'Multi-pass LoRA conditioning with custom glass refraction node.',
        commercialRights: 'Full Commercial Global Buyout Included',
        evidenceLink: 'https://github.com/sophia-ai/lumina-proof',
        evidenceType: 'C2PA Manifest Signed'
      }
    ]
  });

  // -------------------------------------------------------------
  // FEATURE 6: AI PROFILE IMPROVEMENT & COMPLETENESS
  // -------------------------------------------------------------
  const completenessData = useMemo(() => {
    return analyzeProfileCompleteness(formData);
  }, [formData]);

  // -------------------------------------------------------------
  // FEATURE 3 & 4: OPPORTUNITY SCOUTING & MATCHING
  // -------------------------------------------------------------
  const scoutedOpportunities = useMemo(() => {
    return scoutBrandOpportunities(formData, campaigns);
  }, [formData, campaigns]);

  // -------------------------------------------------------------
  // FEATURE 2: PORTFOLIO INTELLIGENCE STATE
  // -------------------------------------------------------------
  const [selectedPieceForAnalysis, setSelectedPieceForAnalysis] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isAnalyzingPiece, setIsAnalyzingPiece] = useState(false);

  // New Portfolio Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newPiece, setNewPiece] = useState({
    title: '',
    category: 'AI Video',
    mediaType: 'AI Video',
    creativeStyle: 'Cinematic',
    aspectRatio: '16:9',
    tools: 'Flux.1 Pro, ComfyUI, Runway Gen-3',
    skills: 'AI Filmmaking, 3D Product Visualization',
    description: '',
    workflowDetails: 'Custom ComfyUI node graph with 4K temporal smoothing and seed lock.',
    commercialRights: 'Full Commercial Global Buyout Included',
    evidenceLink: '',
    evidenceType: 'Verified Workflow Hash',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
  });

  // Modal State for Quick Proposal Application (Feature 5 & 9)
  const [applyModalCampaign, setApplyModalCampaign] = useState(null);
  const [proposalPitch, setProposalPitch] = useState('');
  const [proposalBudget, setProposalBudget] = useState(3500);
  const [proposalTimeline, setProposalTimeline] = useState('3 Weeks');

  // Modal State for Viewing Brand Brief Details
  const [viewBriefModalCampaign, setViewBriefModalCampaign] = useState(null);

  // Pre-set Cover Banner Presets
  const coverPresets = [
    { name: 'Luxury Octane', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Cinematic Sci-Fi', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Digital Couture', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80' },
    { name: '3D Neural World', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Load a preset creator demo
  const loadPresetCreator = (creatorId) => {
    const found = creators.find((c) => c.id === creatorId);
    if (found) {
      setFormData((prev) => ({
        ...prev,
        id: found.id,
        name: found.name,
        handle: found.handle,
        headline: found.headline,
        bio: found.bio,
        category: found.category,
        specialization: found.specialization,
        location: found.location,
        avatar: found.avatar,
        coverImage: found.coverImage,
        startingPrice: found.startingPrice,
        hourlyRate: found.hourlyRate,
        availability: found.availability,
        tools: found.tools,
        skills: found.skills,
        portfolio: found.portfolio || prev.portfolio
      }));

      addToast({
        title: `Loaded ${found.name}'s Profile`,
        message: 'Synchronized profile metadata, declared tools, and portfolio pieces.',
        type: 'info'
      });
    }
  };

  // Toggle declared tool
  const toggleTool = (toolName) => {
    setFormData((prev) => {
      const exists = prev.tools.includes(toolName);
      return {
        ...prev,
        tools: exists ? prev.tools.filter((t) => t !== toolName) : [...prev.tools, toolName]
      };
    });
  };

  // Toggle declared skill
  const toggleSkill = (skillName) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skillName);
      return {
        ...prev,
        skills: exists ? prev.skills.filter((s) => s !== skillName) : [...prev.skills, skillName]
      };
    });
  };

  // -------------------------------------------------------------
  // FEATURE 2: RUN PORTFOLIO INTELLIGENCE AGENT
  // -------------------------------------------------------------
  const handleAnalyzePieceWithAi = (piece) => {
    setSelectedPieceForAnalysis(piece);
    setIsAnalyzingPiece(true);
    setActiveTab('intelligence');

    setTimeout(() => {
      const suggestions = analyzePortfolioPiece(piece, formData);
      setAiSuggestions(suggestions);
      setIsAnalyzingPiece(false);
      addToast({
        title: 'CreatorProof Portfolio Intelligence Complete',
        message: 'AI analyzed metadata, proposed tag refinements, and suggested description improvements.',
        type: 'success'
      });
    }, 700);
  };

  // Apply AI suggestions to selected piece
  const handleApplyAiSuggestions = () => {
    if (!selectedPieceForAnalysis || !aiSuggestions) return;

    const updatedPortfolio = formData.portfolio.map((item) => {
      if (item.id === selectedPieceForAnalysis.id) {
        return {
          ...item,
          category: aiSuggestions.suggestedContentType,
          creativeStyle: aiSuggestions.suggestedStyle,
          aspectRatio: aiSuggestions.suggestedAspectRatio,
          description: aiSuggestions.enhancedDescription,
          skills: Array.from(new Set([...(item.skills || []), ...aiSuggestions.suggestedSkills]))
        };
      }
      return item;
    });

    setFormData((prev) => ({
      ...prev,
      portfolio: updatedPortfolio
    }));

    addToast({
      title: 'AI Suggestions Applied to Project',
      message: 'Portfolio piece metadata and skill tags updated successfully.',
      type: 'success'
    });

    setAiSuggestions(null);
  };

  // Add New Portfolio Piece
  const handleCreatePortfolioPiece = (e) => {
    e.preventDefault();
    if (!newPiece.title.trim()) return;

    const createdItem = {
      id: `port-${Date.now()}`,
      title: newPiece.title,
      category: newPiece.category,
      mediaType: newPiece.mediaType,
      creativeStyle: newPiece.creativeStyle,
      aspectRatio: newPiece.aspectRatio,
      image: newPiece.image,
      tools: newPiece.tools.split(',').map((t) => t.trim()).filter(Boolean),
      skills: newPiece.skills.split(',').map((s) => s.trim()).filter(Boolean),
      description: newPiece.description || `${newPiece.title} - generative commercial concept.`,
      workflowDetails: newPiece.workflowDetails,
      commercialRights: newPiece.commercialRights,
      evidenceLink: newPiece.evidenceLink,
      evidenceType: newPiece.evidenceType
    };

    setFormData((prev) => ({
      ...prev,
      portfolio: [createdItem, ...prev.portfolio]
    }));

    if (addPortfolioItem) {
      addPortfolioItem(createdItem);
    }

    setIsUploadModalOpen(false);

    addToast({
      title: 'Portfolio Piece Uploaded!',
      message: `"${createdItem.title}" has been added to your showcase and indexed for matching.`,
      type: 'success'
    });

    // Automatically trigger Feature 2 Portfolio Intelligence
    handleAnalyzePieceWithAi(createdItem);
  };

  // Delete Portfolio Piece
  const handleDeletePiece = (pieceId) => {
    setFormData((prev) => ({
      ...prev,
      portfolio: prev.portfolio.filter((p) => p.id !== pieceId)
    }));
    if (deletePortfolioItem) {
      deletePortfolioItem(pieceId);
    }
    addToast({
      title: 'Piece Removed',
      message: 'Portfolio project removed from showcase.',
      type: 'info'
    });
  };

  // -------------------------------------------------------------
  // FEATURE 5 & 9: SUBMIT QUICK PROPOSAL TO REAL BRAND BRIEF
  // -------------------------------------------------------------
  const handleOpenApplyModal = (campaign) => {
    setApplyModalCampaign(campaign);
    setProposalBudget(campaign.budget || formData.startingPrice);
    setProposalTimeline(campaign.timeline || '3 Weeks');
    setProposalPitch(
      `Hi ${campaign.brandName} team,\n\nI reviewed your brief for "${campaign.title}". As an AI specialist in ${formData.specialization}, I can deliver your ${campaign.contentType} requirements using my audited ${formData.tools.slice(0, 2).join(' and ')} pipeline with full commercial buyout.`
    );
  };

  const handleSendProposalSubmit = (e) => {
    e.preventDefault();
    if (!applyModalCampaign) return;

    submitProposal({
      campaignId: applyModalCampaign.id,
      pitch: proposalPitch,
      proposedBudget: Number(proposalBudget),
      timeline: proposalTimeline,
      message: proposalPitch
    });

    // Dispatch in-app creator notification
    if (addNotification) {
      addNotification('creator', {
        title: `Proposal Sent to ${applyModalCampaign.brandName}`,
        message: `Your application for "${applyModalCampaign.title}" has been delivered.`,
        type: 'success',
        actionUrl: 'creator-requests'
      });
    }

    setApplyModalCampaign(null);
  };

  // -------------------------------------------------------------
  // SAVE PROFILE
  // -------------------------------------------------------------
  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();

    updateCreatorProfile({
      ...formData,
      startingPrice: Number(formData.startingPrice),
      hourlyRate: Number(formData.hourlyRate)
    });

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });

    addToast({
      title: 'Profile Updated & Published!',
      message: 'Your profile, skills, declared tools, and portfolio pieces are live.',
      type: 'success'
    });
  };

  return (
    <div className="page-content animate-fade-in" style={{ maxWidth: '1280px', paddingBottom: '90px' }}>
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP HEADER & LAUNCH READINESS SCORECARD */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#F5F3FF', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: '#7C3AED', fontSize: '0.8rem', fontWeight: 800, marginBottom: '8px', border: '1px solid #EDE9FE' }}>
            <Zap size={14} />
            <span>KAMPUS.VC CREATOR HUB — AUTONOMOUS PROFILE & OPPORTUNITY WORKSPACE</span>
          </div>
          <h1 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#09090B', letterSpacing: '-0.02em', margin: 0 }}>
            Creator Profile Builder & Opportunity Agent
          </h1>
          <p style={{ color: '#71717A', fontSize: '0.96rem', marginTop: '4px', maxWidth: '880px', lineHeight: 1.5 }}>
            Showcase your AI tools and custom LoRAs, receive actionable profile improvement intelligence, and let the CreatorProof Opportunity Scout match you with real published brand marketing briefs.
          </p>
        </div>

        {/* Header Preset Switcher and Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            onChange={(e) => loadPresetCreator(e.target.value)}
            value={formData.id}
            style={{
              padding: '9px 14px',
              borderRadius: '9999px',
              border: '1.5px solid #E4E4E7',
              backgroundColor: '#FFFFFF',
              color: '#09090B',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <option value="creator-1">Preset: Sophia Chan (Product Filmmaker)</option>
            <option value="creator-2">Preset: Daniel Kim (Sci-Fi VFX Director)</option>
            <option value="creator-3">Preset: Lily Park (Digital Fashion Couture)</option>
            <option value="creator-4">Preset: Ravi Patel (3D Neural Animator)</option>
          </select>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem', fontWeight: 700 }}
          >
            <Plus size={14} color="#7C3AED" />
            <span>Upload Work</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('public-profile-preview')}
            className="btn btn-outline"
            style={{ fontSize: '0.85rem', fontWeight: 700 }}
          >
            <Eye size={14} />
            <span>Live Storefront</span>
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="btn btn-dark"
            style={{ fontSize: '0.86rem', fontWeight: 800, padding: '9px 22px' }}
          >
            <Save size={15} />
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. TRANSPARENT PROFILE COMPLETENESS & OPPORTUNITY SUMMARY BANNER */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          backgroundColor: '#FAFAFA',
          border: '1.5px solid #E4E4E7',
          borderRadius: '20px',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: completenessData.completenessPercent >= 90 ? '#ECFDF5' : '#FFFBEB',
              border: `2.5px solid ${completenessData.completenessPercent >= 90 ? '#10B981' : '#F59E0B'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.05rem',
              color: completenessData.completenessPercent >= 90 ? '#047857' : '#B45309'
            }}
          >
            {completenessData.completenessPercent}%
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 850, fontSize: '1.08rem', color: '#09090B' }}>
                Profile Completeness: {completenessData.completenessPercent}%
              </span>
              <span className="badge badge-verified" style={{ padding: '2px 8px', fontSize: '0.72rem' }}>
                <ShieldCheck size={12} />
                <span>Audited Metadata</span>
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#71717A', marginTop: '2px' }}>
              Based on required field completion: {completenessData.checks.filter((c) => c.passed).length} of {completenessData.checks.length} benchmarks met.
            </div>
          </div>
        </div>

        {/* Opportunity Scout Summary Callout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '10px 16px', borderRadius: '12px', border: '1px solid #E4E4E7', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={18} color="#7C3AED" />
            <div>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 800 }}>
                Opportunity Scout
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#09090B' }}>
                {scoutedOpportunities.length} Active Brand Briefs Matched
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('opportunities');
              opportunitiesSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 800, padding: '9px 18px' }}
          >
            <span>View Opportunities</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. PROFILE HERO CUSTOMIZER & COVER BANNER */}
      {/* ------------------------------------------------------------------ */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', marginBottom: '28px', border: '1.5px solid #E4E4E7' }}>
        <div style={{ height: '220px', backgroundImage: `url(${formData.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(9, 9, 11, 0.78)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '9999px' }}>
            <span style={{ color: '#A1A1AA', fontSize: '0.74rem', fontWeight: 700 }}>Cover Presets:</span>
            {coverPresets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFormData({ ...formData, coverImage: p.url })}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: formData.coverImage === p.url ? '#FFFFFF' : '#A1A1AA',
                  fontSize: '0.74rem',
                  fontWeight: formData.coverImage === p.url ? 800 : 500,
                  cursor: 'pointer',
                  textDecoration: formData.coverImage === p.url ? 'underline' : 'none'
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Avatar & Primary Meta Row */}
        <div style={{ padding: '0 32px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginTop: '-46px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px', flexWrap: 'wrap' }}>
              <img
                src={formData.avatar}
                alt={formData.name}
                style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #FFFFFF', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#09090B', margin: 0 }}>{formData.name}</h2>
                  <span style={{ fontSize: '0.86rem', color: '#71717A', fontWeight: 600 }}>{formData.handle}</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#7C3AED', fontWeight: 750, marginTop: '2px' }}>
                  {formData.specialization}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Starting Rate</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#09090B' }}>${formData.startingPrice}</div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Availability</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>{formData.availability}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 4. WORKSPACE SECTION TABS */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'profile', label: '1. Professional Profile', icon: <User size={15} /> },
          { id: 'tools', label: '2. Skills & AI Tools', icon: <Layers size={15} /> },
          { id: 'portfolio', label: '3. AI Portfolio Showcase', icon: <ImageIcon size={15} /> },
          { id: 'intelligence', label: '4. Portfolio Intelligence', icon: <Sparkles size={15} color="#7C3AED" /> },
          { id: 'improvement', label: '5. Profile Improvement', icon: <CheckCircle2 size={15} color="#059669" /> },
          { id: 'opportunities', label: '6. Brand Opportunity Scout', icon: <Briefcase size={15} color="#2563EB" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`prompt-pill ${activeTab === tab.id ? 'active' : ''}`}
            style={{ padding: '9px 18px', fontSize: '0.86rem', fontWeight: 700, gap: '6px' }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TAB 1: CREATOR PROFESSIONAL PROFILE (FEATURE 1) */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'profile' && (
        <div ref={profileSectionRef} className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* Identity & Bio */}
          <div className="card" style={{ padding: '26px', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 850, marginBottom: '18px', color: '#09090B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#7C3AED" />
              <span>Personal & Professional Information</span>
            </h3>

            <div className="form-group">
              <label className="form-label">Creator Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Username Handle</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Headline</label>
              <input
                type="text"
                className="form-input"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Biography</label>
                <span style={{ fontSize: '0.74rem', color: formData.bio.length >= 50 ? '#059669' : '#D97706', fontWeight: 700 }}>
                  {formData.bio.length} characters (min. 50)
                </span>
              </div>
              <textarea
                className="form-textarea"
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Availability</label>
                <select
                  className="form-select"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                >
                  <option value="Available (Immediate)">Available (Immediate)</option>
                  <option value="Available (Taking new projects)">Available (Taking new projects)</option>
                  <option value="Booking for Next Month">Booking for Next Month</option>
                  <option value="On Retainer / Limited">On Retainer / Limited</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing, Categories & Commercial Terms */}
          <div className="card" style={{ padding: '26px', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 850, marginBottom: '18px', color: '#09090B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={18} color="#059669" />
              <span>Rates, Specializations & Commercial Licensing</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Starting Project Rate ($ USD)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hourly Consulting ($ USD)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Creative Specialization</label>
              <input
                type="text"
                className="form-input"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Commercial Rights & Buyout Policy</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.usageRights}
                onChange={(e) => setFormData({ ...formData, usageRights: e.target.value })}
              />
            </div>

            {/* 3 Tiered Packages */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <div style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '10px' }}>
                Service Package Tiers ({formData.packages.length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {formData.packages.map((pkg, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#09090B' }}>{pkg.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#71717A' }}>⏱ {pkg.timeline} • {pkg.revisions}</div>
                    </div>
                    <span style={{ fontWeight: 900, fontSize: '1rem', color: '#09090B' }}>${pkg.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 2: SKILLS & AI TOOLS (FEATURE 1) */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'tools' && (
        <div ref={toolsSectionRef} className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {/* AI Tools Selection */}
          <div className="card" style={{ padding: '26px', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 850, marginBottom: '10px', color: '#09090B' }}>
              Declared AI Tools & Models
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#71717A', marginBottom: '16px' }}>
              Select the generative tools and model checkpoints you master. Brand brief matching engine indexes these declarations.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
              {[
                'Flux.1 Pro',
                'ComfyUI',
                'Midjourney v6.1',
                'Runway Gen-3',
                'OpenAI Sora',
                'Kling AI',
                'Stable Diffusion 3.5',
                'Luma Dream Machine',
                'Magnific AI',
                'Topaz Video AI',
                'Blender 4.2',
                'ElevenLabs'
              ].map((tool) => {
                const isSelected = formData.tools.includes(tool);
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`prompt-pill ${isSelected ? 'active' : ''}`}
                    style={{ fontSize: '0.84rem', fontWeight: 700 }}
                  >
                    {isSelected && <Check size={13} />}
                    <span>{tool}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom LoRA Weights */}
            <h4 style={{ fontSize: '0.98rem', fontWeight: 850, marginBottom: '10px', color: '#09090B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Code2 size={16} color="#7C3AED" />
              <span>Custom Trained LoRA Weights</span>
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {formData.customLoras.map((lora, idx) => (
                <div key={idx} style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#09090B' }}>{lora.name}</span>
                    <span style={{ fontSize: '0.72rem', backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                      {lora.baseModel}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#71717A' }}>
                    Trigger: <code style={{ backgroundColor: '#FFFFFF', padding: '1px 5px', borderRadius: '4px' }}>{lora.trigger}</code> ({lora.epochs})
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Declared Skills */}
          <div className="card" style={{ padding: '26px', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 850, marginBottom: '10px', color: '#09090B' }}>
              Creative & Production Skills
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#71717A', marginBottom: '16px' }}>
              Declare creative production disciplines verified through your portfolio pieces.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                'AI Filmmaking',
                'AI Animation',
                'AI Image Generation',
                'Prompt Engineering',
                'Product Advertising',
                'Social Media Content Creation',
                'Motion Graphics',
                'Video Editing',
                'AI Storytelling',
                '3D Product Visualization',
                'Custom LoRA Training',
                'Temporal Coherence',
                'Color Grading',
                'Photorealism',
                'Fluid Simulation'
              ].map((skill) => {
                const isSelected = formData.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`prompt-pill ${isSelected ? 'active' : ''}`}
                    style={{ fontSize: '0.82rem', fontWeight: 700 }}
                  >
                    {isSelected && <Check size={13} />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 3: AI PORTFOLIO SHOWCASE & WORKFLOWS (FEATURE 1 & 2) */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'portfolio' && (
        <div ref={portfolioSectionRef} className="animate-fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 850, margin: 0, color: '#09090B' }}>
                AI Portfolio Showcase & Production Workflows
              </h3>
              <p style={{ color: '#71717A', fontSize: '0.88rem', margin: '3px 0 0' }}>
                Showcase AI-generated videos, animations, and renders with documented ComfyUI node graphs and commercial rights.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 800, padding: '9px 18px' }}
            >
              <Plus size={15} />
              <span>Upload New Project</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
            {formData.portfolio.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{ padding: 0, overflow: 'hidden', border: '1.5px solid var(--border-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ position: 'relative', height: '190px' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                      <span className="badge badge-dark" style={{ fontSize: '0.72rem', backgroundColor: 'rgba(9, 9, 11, 0.85)' }}>
                        {item.category}
                      </span>
                      {item.aspectRatio && (
                        <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                          {item.aspectRatio}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '18px' }}>
                    <h4 style={{ fontSize: '1.08rem', fontWeight: 850, color: '#09090B', margin: '0 0 6px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: '#52525B', lineHeight: 1.45, margin: '0 0 12px' }}>
                      {item.description}
                    </p>

                    {/* Workflow details */}
                    {item.workflowDetails && (
                      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.76rem', color: '#52525B', marginBottom: '12px' }}>
                        <strong>Workflow:</strong> {item.workflowDetails}
                      </div>
                    )}

                    {/* Tools and Skills chips */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                      {item.tools?.map((t, idx) => (
                        <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>
                          ⚡ {t}
                        </span>
                      ))}
                      {item.skills?.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="badge badge-gray" style={{ fontSize: '0.68rem' }}>
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Piece Actions Toolbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--bg-secondary)' }}>
                  <button
                    type="button"
                    onClick={() => handleAnalyzePieceWithAi(item)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.76rem', fontWeight: 700 }}
                  >
                    <Sparkles size={12} color="#7C3AED" />
                    <span>AI Portfolio Intelligence</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePiece(item.id)}
                    style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                    title="Remove project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 4: CREATORPROOF PORTFOLIO INTELLIGENCE (FEATURE 2) */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'intelligence' && (
        <div ref={intelligenceSectionRef} className="animate-fade-in">
          <div className="card" style={{ padding: '26px', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-light)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Sparkles size={15} />
                  <span>Feature 2 — CreatorProof Portfolio Intelligence</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 850, margin: '4px 0 0', color: '#09090B' }}>
                  AI Portfolio Analysis & Metadata Optimizer
                </h3>
              </div>
            </div>

            <p style={{ color: '#71717A', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
              Select any project from your portfolio to inspect. CreatorProof Portfolio Intelligence evaluates your visual concept and workflow metadata to suggest agency-grade descriptions, skill tags, and commercial positioning. All suggestions are editable and require your confirmation.
            </p>

            {/* Project Picker for Analysis */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {formData.portfolio.map((piece) => (
                <button
                  key={piece.id}
                  type="button"
                  onClick={() => handleAnalyzePieceWithAi(piece)}
                  className="btn btn-outline btn-sm"
                  style={{
                    borderColor: selectedPieceForAnalysis?.id === piece.id ? '#7C3AED' : 'var(--border-light)',
                    backgroundColor: selectedPieceForAnalysis?.id === piece.id ? '#F5F3FF' : '#FFFFFF',
                    fontWeight: 700
                  }}
                >
                  <ImageIcon size={13} />
                  <span>{piece.title}</span>
                </button>
              ))}
            </div>

            {/* Analysis Loading State */}
            {isAnalyzingPiece && (
              <div style={{ padding: '28px', textAlign: 'center', backgroundColor: '#F5F3FF', borderRadius: '14px', border: '1px solid #DDD6FE' }}>
                <RefreshCw size={24} className="animate-spin" color="#7C3AED" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 800, color: '#6D28D9', fontSize: '0.95rem' }}>
                  CreatorProof Portfolio Intelligence Analyzing Metadata & Workflow...
                </div>
                <div style={{ fontSize: '0.82rem', color: '#7C3AED', marginTop: '4px' }}>
                  Extracting skills, classifying visual style, and synthesizing enhanced copy.
                </div>
              </div>
            )}

            {/* Analysis Results Display */}
            {aiSuggestions && selectedPieceForAnalysis && !isAnalyzingPiece && (
              <div style={{ backgroundColor: '#FAFAFA', border: '1.5px solid #E4E4E7', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span className="badge badge-indigo" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                      Analysis for: {selectedPieceForAnalysis.title}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: '#71717A', marginTop: '2px' }}>
                      {aiSuggestions.confidence}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyAiSuggestions}
                    className="btn btn-primary btn-sm"
                    style={{ fontWeight: 800, padding: '8px 18px' }}
                  >
                    <Check size={14} />
                    <span>Confirm & Apply Suggestions</span>
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '18px' }}>
                  {/* Content Type & Style */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '10px', border: '1px solid #E4E4E7' }}>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 800 }}>Suggested Content Type & Style</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <span className="badge badge-dark">{aiSuggestions.suggestedContentType}</span>
                      <span className="badge badge-gray">{aiSuggestions.suggestedStyle}</span>
                      <span className="badge badge-gray">{aiSuggestions.suggestedAspectRatio}</span>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '10px', border: '1px solid #E4E4E7' }}>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 800 }}>Recommended Specialization</div>
                    <div style={{ fontWeight: 800, color: '#7C3AED', fontSize: '0.92rem', marginTop: '6px' }}>
                      {aiSuggestions.suggestedSpecialization}
                    </div>
                  </div>
                </div>

                {/* Enhanced Description */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E4E4E7', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 800, marginBottom: '6px' }}>
                    Suggested Agency-Ready Description (Editable):
                  </div>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={aiSuggestions.enhancedDescription}
                    onChange={(e) =>
                      setAiSuggestions({ ...aiSuggestions, enhancedDescription: e.target.value })
                    }
                    style={{ fontSize: '0.9rem' }}
                  />
                </div>

                {/* Suggested Skill Tags */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E4E4E7', marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 800, marginBottom: '6px' }}>
                    Suggested Skill Tags:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {aiSuggestions.suggestedSkills.map((s, idx) => (
                      <span key={idx} className="badge badge-emerald" style={{ fontSize: '0.76rem' }}>
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Presentation Improvements */}
                {aiSuggestions.presentationImprovements.length > 0 && (
                  <div style={{ backgroundColor: '#FFFBEB', padding: '14px 16px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                    <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#B45309', fontWeight: 800, marginBottom: '4px' }}>
                      Presentation & Missing Metadata Suggestions:
                    </div>
                    {aiSuggestions.presentationImprovements.map((tip, idx) => (
                      <div key={idx} style={{ fontSize: '0.8rem', color: '#92400E', marginTop: '3px' }}>
                        • {tip}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 5: AI PROFILE IMPROVEMENT ASSISTANT (FEATURE 6) */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'improvement' && (
        <div ref={improvementSectionRef} className="animate-fade-in">
          <div className="card" style={{ padding: '26px', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-light)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <CheckCircle2 size={15} />
                  <span>Feature 6 — AI Profile Improvement Assistant</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 850, margin: '4px 0 0', color: '#09090B' }}>
                  Improve Your Creator Profile
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 900, color: completenessData.completenessPercent >= 90 ? '#059669' : '#D97706' }}>
                  {completenessData.completenessPercent}% Complete
                </span>
              </div>
            </div>

            <p style={{ color: '#71717A', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
              CreatorProof AI scans your profile for missing or weakly documented fields. Complete these high-priority recommendations to maximize your visibility in brand opportunity scouting.
            </p>

            {/* Checklist items */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '24px' }}>
              {completenessData.checks.map((chk, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    backgroundColor: chk.passed ? '#ECFDF5' : '#FAFAFA',
                    border: chk.passed ? '1px solid #A7F3D0' : '1px solid #E4E4E7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  {chk.passed ? (
                    <CheckCircle2 size={16} color="#059669" />
                  ) : (
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #A1A1AA', display: 'inline-block' }} />
                  )}
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: chk.passed ? '#065F46' : '#52525B' }}>
                    {chk.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Actionable Recommendations */}
            <h4 style={{ fontSize: '1.05rem', fontWeight: 850, marginBottom: '14px', color: '#09090B' }}>
              Actionable Optimization Recommendations ({completenessData.recommendations.length}):
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {completenessData.recommendations.map((rec) => (
                <div
                  key={rec.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    backgroundColor: rec.priority === 'high' ? '#FEF2F2' : '#FFFBEB',
                    border: rec.priority === 'high' ? '1.5px solid #FECACA' : '1.5px solid #FDE68A',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                >
                  <div style={{ maxWidth: '780px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          backgroundColor: rec.priority === 'high' ? '#DC2626' : '#D97706',
                          color: '#FFFFFF'
                        }}
                      >
                        {rec.priority} Priority
                      </span>
                      <strong style={{ fontSize: '0.94rem', color: '#09090B' }}>{rec.title}</strong>
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#52525B', margin: 0, lineHeight: 1.45 }}>
                      {rec.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (rec.actionType === 'add-tools') setActiveTab('tools');
                      else if (rec.actionType === 'upload-portfolio') setIsUploadModalOpen(true);
                      else setActiveTab('profile');
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ backgroundColor: '#FFFFFF', fontWeight: 700 }}
                  >
                    <span>Fix This</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* TAB 6: CREATORPROOF OPPORTUNITY SCOUT (FEATURE 3, 4 & 5) */}
      {/* ------------------------------------------------------------------ */}
      {activeTab === 'opportunities' && (
        <div ref={opportunitiesSectionRef} className="animate-fade-in">
          <div className="card" style={{ padding: '26px', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-light)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  <Briefcase size={15} />
                  <span>Feature 3, 4 & 5 — CreatorProof Opportunity Scout</span>
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 850, margin: '4px 0 0', color: '#09090B' }}>
                  Brands Looking for Your Creative Skills
                </h3>
                <p style={{ color: '#71717A', fontSize: '0.88rem', margin: '4px 0 0' }}>
                  Real published brand marketing briefs ranked by deterministic compatibility (30% Skills, 25% Portfolio, 20% Tools, 15% Budget, 10% Availability).
                </p>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#09090B', backgroundColor: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)' }}>
                {scoutedOpportunities.length} Active Briefs Available
              </div>
            </div>

            {/* Opportunity Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '22px' }}>
              {scoutedOpportunities.map(({ campaign, score, matchedSkills, matchedTools, missingRequirements, whyYouMatch }) => {
                const isSaved = savedOpportunityIds.includes(campaign.id);

                return (
                  <div
                    key={campaign.id}
                    style={{
                      border: '1.5px solid var(--border-light)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '22px',
                      backgroundColor: 'var(--bg-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      {/* Brand Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={campaign.brandLogo}
                            alt={campaign.brandName}
                            style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border-light)' }}
                          />
                          <div>
                            <div style={{ fontWeight: 850, fontSize: '0.98rem', color: '#09090B' }}>{campaign.brandName}</div>
                            <div style={{ fontSize: '0.78rem', color: '#71717A' }}>Deadline: {campaign.deadline || 'Q4 Target'}</div>
                          </div>
                        </div>

                        <MatchScoreBadge score={score} />
                      </div>

                      {/* Campaign Title & Objective */}
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 850, color: '#09090B', marginBottom: '6px' }}>
                        {campaign.title}
                      </h4>
                      <p style={{ fontSize: '0.84rem', color: '#52525B', lineHeight: 1.45, marginBottom: '14px' }}>
                        {campaign.objective || campaign.description}
                      </p>

                      {/* Why You Match Rationale */}
                      <div style={{ backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', marginBottom: '12px' }}>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 800, marginBottom: '2px' }}>
                          Why You Match:
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#065F46', fontWeight: 600 }}>
                          ✓ {whyYouMatch}
                        </div>
                      </div>

                      {/* Matched Tools & Skills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '12px' }}>
                        {matchedTools.map((t, idx) => (
                          <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                            ✓ {t}
                          </span>
                        ))}
                        {matchedSkills.map((s, idx) => (
                          <span key={idx} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                            ✓ {s}
                          </span>
                        ))}
                      </div>

                      {/* Missing Requirements (if any) */}
                      {missingRequirements.length > 0 && (
                        <div style={{ backgroundColor: '#FFFBEB', padding: '8px 12px', borderRadius: '6px', border: '1px solid #FDE68A', marginBottom: '12px', fontSize: '0.76rem', color: '#92400E' }}>
                          {missingRequirements.map((gap, idx) => (
                            <div key={idx}>• {gap}</div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Toolbar */}
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 700 }}>Published Budget</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#059669' }}>
                          ${campaign.budget?.toLocaleString() || 'Negotiable'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => toggleSaveOpportunity && toggleSaveOpportunity(campaign.id)}
                          className="btn btn-outline btn-sm"
                          title="Save opportunity"
                        >
                          <Bookmark size={14} fill={isSaved ? '#18181B' : 'none'} />
                        </button>

                        <button
                          type="button"
                          onClick={() => setViewBriefModalCampaign(campaign)}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.78rem' }}
                        >
                          <Eye size={13} />
                          <span>Brief</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenApplyModal(campaign)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.8rem', fontWeight: 800 }}
                        >
                          <span>Apply</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 1: UPLOAD NEW AI PORTFOLIO WORK (FEATURE 1 & 2) */}
      {/* ------------------------------------------------------------------ */}
      {isUploadModalOpen && (
        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload AI Portfolio Piece & Document Workflow"
          maxWidth="640px"
        >
          <form onSubmit={handleCreatePortfolioPiece} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Project Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CyberCouture: Tokyo Holographic Runway"
                value={newPiece.title}
                onChange={(e) => setNewPiece({ ...newPiece, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Content Type</label>
                <select
                  className="form-select"
                  value={newPiece.category}
                  onChange={(e) => setNewPiece({ ...newPiece, category: e.target.value })}
                >
                  <option value="AI Video">AI Video</option>
                  <option value="AI Animation">AI Animation</option>
                  <option value="AI Images">AI Images</option>
                  <option value="AI Graphics">AI Graphics</option>
                  <option value="3D Visuals">3D Visuals</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Creative Style</label>
                <select
                  className="form-select"
                  value={newPiece.creativeStyle}
                  onChange={(e) => setNewPiece({ ...newPiece, creativeStyle: e.target.value })}
                >
                  <option value="Cinematic">Cinematic</option>
                  <option value="Photorealistic">Photorealistic</option>
                  <option value="Futuristic">Futuristic</option>
                  <option value="3D">3D</option>
                  <option value="Minimalist">Minimalist</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Aspect Ratio</label>
                <select
                  className="form-select"
                  value={newPiece.aspectRatio}
                  onChange={(e) => setNewPiece({ ...newPiece, aspectRatio: e.target.value })}
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Vertical Reels/TikTok)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:5">4:5 (Portrait)</option>
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">AI Tools / Models Used</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Flux.1 Pro, ComfyUI, Runway Gen-3"
                  value={newPiece.tools}
                  onChange={(e) => setNewPiece({ ...newPiece, tools: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Project Description</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Describe your creative approach or prompt narrative..."
                value={newPiece.description}
                onChange={(e) => setNewPiece({ ...newPiece, description: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Production Workflow Documentation (ComfyUI / Seeds / Pipeline)</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Detail your ComfyUI node graph, LoRA checkpoint, upscaling pass..."
                value={newPiece.workflowDetails}
                onChange={(e) => setNewPiece({ ...newPiece, workflowDetails: e.target.value })}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Preview Media Image URL</label>
              <input
                type="text"
                className="form-input"
                value={newPiece.image}
                onChange={(e) => setNewPiece({ ...newPiece, image: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ fontWeight: 800 }}
              >
                <span>Upload & Run AI Intelligence</span>
                <Sparkles size={14} />
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 2: APPLY FOR PROJECT / QUICK PROPOSAL (FEATURE 5 & 9) */}
      {/* ------------------------------------------------------------------ */}
      {applyModalCampaign && (
        <Modal
          isOpen={!!applyModalCampaign}
          onClose={() => setApplyModalCampaign(null)}
          title={`Apply for Campaign: ${applyModalCampaign.title}`}
          maxWidth="600px"
        >
          <form onSubmit={handleSendProposalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px' }}>
              <img
                src={applyModalCampaign.brandLogo}
                alt={applyModalCampaign.brandName}
                style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 850, fontSize: '0.96rem' }}>{applyModalCampaign.brandName}</div>
                <div style={{ fontSize: '0.78rem', color: '#71717A' }}>
                  Target Budget: ${applyModalCampaign.budget?.toLocaleString() || '3,500'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Proposed Escrow Fee ($ USD)</label>
                <input
                  type="number"
                  className="form-input"
                  value={proposalBudget}
                  onChange={(e) => setProposalBudget(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Delivery Timeline</label>
                <input
                  type="text"
                  className="form-input"
                  value={proposalTimeline}
                  onChange={(e) => setProposalTimeline(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Your Pitch & Creative Approach</label>
              <textarea
                className="form-textarea"
                rows={5}
                value={proposalPitch}
                onChange={(e) => setProposalPitch(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setApplyModalCampaign(null)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ fontWeight: 800 }}
              >
                <Send size={14} />
                <span>Submit Authorized Proposal</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 3: VIEW BRAND BRIEF DETAILS (FEATURE 5) */}
      {/* ------------------------------------------------------------------ */}
      {viewBriefModalCampaign && (
        <Modal
          isOpen={!!viewBriefModalCampaign}
          onClose={() => setViewBriefModalCampaign(null)}
          title={`Brand Brief: ${viewBriefModalCampaign.title}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '10px' }}>
              <img
                src={viewBriefModalCampaign.brandLogo}
                alt={viewBriefModalCampaign.brandName}
                style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 850, fontSize: '1rem' }}>{viewBriefModalCampaign.brandName}</div>
                <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 800 }}>
                  Budget: ${viewBriefModalCampaign.budget?.toLocaleString() || 'Negotiable'}
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 800 }}>
                Campaign Objective
              </div>
              <div style={{ fontSize: '0.88rem', color: '#09090B', lineHeight: 1.5, marginTop: '2px' }}>
                {viewBriefModalCampaign.objective || viewBriefModalCampaign.description}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 800 }}>
                Required Deliverables:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                {viewBriefModalCampaign.deliverables?.map((d, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: '#52525B' }}>
                    <CheckCircle2 size={14} color="#059669" />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 700 }}>Required AI Tools</div>
                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#09090B' }}>
                  {viewBriefModalCampaign.requiredTools?.join(', ') || 'Any supported AI engine'}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#71717A', fontWeight: 700 }}>Commercial Terms</div>
                <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#09090B' }}>
                  {viewBriefModalCampaign.usageRights || viewBriefModalCampaign.licensingScope || 'Commercial Buyout'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
              <button
                type="button"
                onClick={() => setViewBriefModalCampaign(null)}
                className="btn btn-outline btn-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const camp = viewBriefModalCampaign;
                  setViewBriefModalCampaign(null);
                  handleOpenApplyModal(camp);
                }}
                className="btn btn-primary btn-sm"
                style={{ fontWeight: 800 }}
              >
                <span>Apply for this Brief</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Floating Save Quick Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '32px',
          zIndex: 50,
          backgroundColor: '#09090B',
          color: '#FFFFFF',
          padding: '10px 18px',
          borderRadius: '9999px',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: '1px solid #27272A'
        }}
      >
        <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#E4E4E7' }}>
          Profile Completeness: <strong>{completenessData.completenessPercent}%</strong>
        </span>
        <button
          type="button"
          onClick={handleSaveProfile}
          className="btn"
          style={{
            backgroundColor: '#FFFFFF',
            color: '#09090B',
            padding: '7px 18px',
            fontSize: '0.84rem',
            fontWeight: 800
          }}
        >
          <Save size={14} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default MyCreatorProfilePage;
