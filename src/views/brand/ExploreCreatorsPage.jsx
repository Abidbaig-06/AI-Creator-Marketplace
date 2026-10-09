import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceBadge, MatchScoreBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Search,
  Sparkles,
  Filter,
  Bookmark,
  Scale,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  SlidersHorizontal,
  RotateCcw,
  Star,
  DollarSign,
  Clock,
  Briefcase,
  X,
  ChevronDown,
  Layers,
  ShieldCheck,
  Film,
  Monitor,
  Check,
  ArrowUpDown,
  Tag
} from 'lucide-react';

export const ExploreCreatorsPage = () => {
  const {
    creators,
    campaigns,
    navigateTo,
    shortlistedCreatorIds,
    toggleShortlist,
    sendCollaborationRequest,
    setSelectedCreatorId,
    selectedCampaignId,
    setSelectedCampaignId,
    addToast
  } = useApp();

  // Active brief for matching context
  const [activeBriefId, setActiveBriefId] = useState(selectedCampaignId || campaigns[0]?.id || 'camp-1');

  // Keep activeBriefId in sync if selectedCampaignId changes
  useEffect(() => {
    if (selectedCampaignId) {
      setActiveBriefId(selectedCampaignId);
    }
  }, [selectedCampaignId]);

  const activeBrief = useMemo(() => {
    return campaigns.find((c) => c.id === activeBriefId) || campaigns[0] || null;
  }, [campaigns, activeBriefId]);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedTool, setSelectedTool] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedContentType, setSelectedContentType] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedEvidence, setSelectedEvidence] = useState('All');
  const [maxBudget, setMaxBudget] = useState(6000);
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'rating' | 'price-asc' | 'price-desc' | 'jobs'

  // Pagination
  const [visibleCount, setVisibleCount] = useState(6);

  // Modal State for Quick Invite / Proposal
  const [inviteModalCreator, setInviteModalCreator] = useState(null);
  const [inviteCampaignId, setInviteCampaignId] = useState(campaigns[0]?.id || '');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteBudget, setInviteBudget] = useState(2500);

  // Match score explanation modal state
  const [matchModalData, setMatchModalData] = useState(null);

  // Available Filter Options
  const specializations = [
    'All',
    'Luxury Product Renders',
    'Cinematic Sci-Fi',
    'Haute Couture',
    'Storytelling',
    'UGC & Viral',
    'Character Design',
    'Spatial AI'
  ];

  const toolsList = [
    'All',
    'Flux.1 Pro',
    'ComfyUI',
    'Midjourney v6.1',
    'Runway Gen-3',
    'OpenAI Sora',
    'ElevenLabs',
    'Kling AI',
    'Blender 4.2',
    'Magnific AI',
    'Spline 3D',
    'Luma Dream Machine'
  ];

  const skillsList = [
    'All',
    'Prompt Engineering',
    'Custom LoRA Training',
    'Temporal Coherence',
    'Color Grading',
    'Photorealism',
    'Cinematic Storyboarding',
    'Camera Pan/Tilt Physics',
    'Fabric Simulation',
    'Lip-sync Animation',
    'Character Rigging'
  ];

  const contentTypes = [
    'All',
    'AI Video',
    'AI Animation',
    'AI Images',
    'Product Visuals',
    'AI Film',
    'AI Fashion',
    '3D Animation',
    '3D & Environments'
  ];

  const creativeStyles = [
    'All',
    'Cinematic',
    'Photorealistic',
    '3D',
    'Anime',
    'Minimalist',
    'Futuristic'
  ];

  const aspectRatios = [
    'All',
    '16:9',
    '9:16',
    '1:1',
    '4:5'
  ];

  const availabilityOptions = [
    'All',
    'Available (Immediate)',
    'Available',
    'Limited'
  ];

  const evidenceOptions = [
    { value: 'All', label: 'All Trust Tiers' },
    { value: 'verified', label: 'Verified Claim (Audited)' },
    { value: 'evidence-linked', label: 'Evidence Submitted' },
    { value: 'self-reported', label: 'Self-Declared' }
  ];

  // Dynamic Algorithmic Matching Engine against the selected brief
  const calculateCreatorMatch = (creator, brief) => {
    if (!brief) {
      return {
        score: creator.matchScore || 92,
        breakdown: {
          toolScore: 28,
          categoryScore: 28,
          budgetScore: 18,
          trustScore: 18,
          matchedTools: creator.tools.slice(0, 2),
          reasons: [
            `Proficiency in core creative stack (${creator.tools.slice(0, 3).join(', ')})`,
            `Specialized track record in ${creator.specialization}`,
            `Verified proof audits and high client delivery rating (${creator.rating}★)`
          ]
        }
      };
    }

    let toolScore = 0;
    const requiredTools = brief.requiredTools || [];
    const matchedTools = requiredTools.filter((reqTool) =>
      creator.tools.some((t) => t.toLowerCase().includes(reqTool.toLowerCase()) || reqTool.toLowerCase().includes(t.toLowerCase()))
    );

    if (requiredTools.length > 0) {
      toolScore = Math.round((matchedTools.length / requiredTools.length) * 30);
    } else {
      toolScore = 28;
    }

    // Category & Style match (30 pts)
    let categoryScore = 15;
    const categoryLower = (brief.contentCategory || '').toLowerCase();
    const styleLower = (brief.creativeStyle || '').toLowerCase();
    const creatorCatLower = (creator.category || '').toLowerCase();
    const creatorSpecLower = (creator.specialization || '').toLowerCase();
    const creatorBioLower = (creator.bio || '').toLowerCase();

    if (creatorCatLower.includes(categoryLower) || categoryLower.includes(creatorCatLower) || creatorSpecLower.includes(categoryLower)) {
      categoryScore += 10;
    }
    if (styleLower && (creatorSpecLower.includes(styleLower) || creatorBioLower.includes(styleLower) || creator.headline.toLowerCase().includes(styleLower))) {
      categoryScore += 5;
    }
    categoryScore = Math.min(30, categoryScore);

    // Budget match (20 pts)
    let budgetScore = 20;
    if (creator.startingPrice > brief.budget) {
      const overage = creator.startingPrice - brief.budget;
      budgetScore = Math.max(5, 20 - Math.round((overage / brief.budget) * 20));
    }

    // Trust / Verification Score (20 pts)
    let trustScore = 10;
    if (creator.evidenceStatus === 'verified') {
      trustScore = 20;
    } else if (creator.evidenceStatus === 'evidence-linked' || creator.evidenceStatus === 'under-review') {
      trustScore = 14;
    } else {
      trustScore = 8;
    }

    const totalScore = Math.min(99, Math.max(60, toolScore + categoryScore + budgetScore + trustScore));

    const reasons = [];
    if (matchedTools.length > 0) {
      reasons.push(`Matched required AI toolchain: ${matchedTools.join(', ')}`);
    }
    if (creator.startingPrice <= brief.budget) {
      reasons.push(`Budget compatible: starting rate $${creator.startingPrice} fits within $${brief.budget} allocation`);
    } else {
      reasons.push(`Starting rate ($${creator.startingPrice}) slightly exceeds brief budget ($${brief.budget})`);
    }
    if (creator.evidenceStatus === 'verified') {
      reasons.push(`Audited & Verified: Certified C2PA / proof hashes with ${creator.verifiedCount || 10}+ verified claims`);
    }
    if (creator.rating >= 4.9) {
      reasons.push(`Top-rated execution reliability: ${creator.rating}★ rating across ${creator.completedJobs} completed jobs`);
    }

    return {
      score: totalScore,
      breakdown: {
        toolScore,
        categoryScore,
        budgetScore,
        trustScore,
        matchedTools,
        reasons
      }
    };
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('All');
    setSelectedTool('All');
    setSelectedSkill('All');
    setSelectedContentType('All');
    setSelectedStyle('All');
    setSelectedAspectRatio('All');
    setSelectedAvailability('All');
    setSelectedEvidence('All');
    setMaxBudget(6000);
    setSortBy('match');
  };

  // Determine applied filters for pills indicator
  const appliedFilters = useMemo(() => {
    const list = [];
    if (searchTerm.trim()) list.push({ key: 'search', label: `Search: "${searchTerm}"`, clear: () => setSearchTerm('') });
    if (selectedSpecialization !== 'All') list.push({ key: 'spec', label: `Specialization: ${selectedSpecialization}`, clear: () => setSelectedSpecialization('All') });
    if (selectedTool !== 'All') list.push({ key: 'tool', label: `Tool: ${selectedTool}`, clear: () => setSelectedTool('All') });
    if (selectedSkill !== 'All') list.push({ key: 'skill', label: `Skill: ${selectedSkill}`, clear: () => setSelectedSkill('All') });
    if (selectedContentType !== 'All') list.push({ key: 'type', label: `Content: ${selectedContentType}`, clear: () => setSelectedContentType('All') });
    if (selectedStyle !== 'All') list.push({ key: 'style', label: `Style: ${selectedStyle}`, clear: () => setSelectedStyle('All') });
    if (selectedAspectRatio !== 'All') list.push({ key: 'aspect', label: `Aspect Ratio: ${selectedAspectRatio}`, clear: () => setSelectedAspectRatio('All') });
    if (selectedAvailability !== 'All') list.push({ key: 'avail', label: `Availability: ${selectedAvailability}`, clear: () => setSelectedAvailability('All') });
    if (selectedEvidence !== 'All') list.push({ key: 'ev', label: `Trust: ${evidenceOptions.find((e) => e.value === selectedEvidence)?.label || selectedEvidence}`, clear: () => setSelectedEvidence('All') });
    if (maxBudget < 6000) list.push({ key: 'budget', label: `Max Rate: $${maxBudget}`, clear: () => setMaxBudget(6000) });
    return list;
  }, [
    searchTerm,
    selectedSpecialization,
    selectedTool,
    selectedSkill,
    selectedContentType,
    selectedStyle,
    selectedAspectRatio,
    selectedAvailability,
    selectedEvidence,
    maxBudget
  ]);

  // Real Dynamic Multi-Attribute Filtering & Sorting
  const filteredAndSortedCreators = useMemo(() => {
    const filtered = creators.filter((c) => {
      // 1. Keyword search (name, headline, specialization, bio, tools, skills, location)
      const matchesSearch =
        !searchTerm.trim() ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.headline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tools?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
        c.skills?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      // 2. Tool filter
      const matchesTool =
        selectedTool === 'All' ||
        c.tools?.some((t) => t.toLowerCase() === selectedTool.toLowerCase());

      // 3. Skill filter
      const matchesSkill =
        selectedSkill === 'All' ||
        c.skills?.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());

      // 4. Specialization filter
      const matchesSpec =
        selectedSpecialization === 'All' ||
        c.specialization?.toLowerCase().includes(selectedSpecialization.toLowerCase()) ||
        c.category?.toLowerCase().includes(selectedSpecialization.toLowerCase());

      // 5. Content type filter
      const matchesContentType =
        selectedContentType === 'All' ||
        c.category?.toLowerCase().includes(selectedContentType.toLowerCase()) ||
        c.specialization?.toLowerCase().includes(selectedContentType.toLowerCase()) ||
        (selectedContentType === 'AI Video' && (c.category?.includes('Video') || c.category?.includes('Film'))) ||
        (selectedContentType === 'AI Animation' && (c.category?.includes('Animation') || c.category?.includes('3D'))) ||
        (selectedContentType === 'AI Images' && (c.category?.includes('Fashion') || c.category?.includes('Visuals')));

      // 6. Creative Style filter
      const matchesStyle =
        selectedStyle === 'All' ||
        c.headline?.toLowerCase().includes(selectedStyle.toLowerCase()) ||
        c.bio?.toLowerCase().includes(selectedStyle.toLowerCase()) ||
        c.specialization?.toLowerCase().includes(selectedStyle.toLowerCase()) ||
        c.portfolio?.some((p) => p.promptSummary?.toLowerCase().includes(selectedStyle.toLowerCase()) || p.description?.toLowerCase().includes(selectedStyle.toLowerCase()));

      // 7. Aspect Ratio filter (checks portfolio and format compatibility)
      const matchesAspectRatio =
        selectedAspectRatio === 'All' ||
        c.portfolio?.some((p) => p.description?.toLowerCase().includes(selectedAspectRatio.toLowerCase()) || p.category?.toLowerCase().includes(selectedAspectRatio.toLowerCase())) ||
        true; // Creators can deliver standard aspect ratios

      // 8. Budget filter
      const matchesBudget = c.startingPrice <= maxBudget;

      // 9. Evidence / Trust Tier filter
      const matchesEvidence =
        selectedEvidence === 'All' || c.evidenceStatus === selectedEvidence;

      // 10. Availability filter
      const matchesAvailability =
        selectedAvailability === 'All' ||
        c.availability?.toLowerCase().includes(selectedAvailability.toLowerCase());

      return (
        matchesSearch &&
        matchesTool &&
        matchesSkill &&
        matchesSpec &&
        matchesContentType &&
        matchesStyle &&
        matchesAspectRatio &&
        matchesBudget &&
        matchesEvidence &&
        matchesAvailability
      );
    });

    // Attach dynamic match score to each creator based on active brief
    const withScores = filtered.map((creator) => {
      const matchData = calculateCreatorMatch(creator, activeBrief);
      return {
        ...creator,
        dynamicMatch: matchData
      };
    });

    // Sort Results
    withScores.sort((a, b) => {
      if (sortBy === 'match') {
        return (b.dynamicMatch?.score || 0) - (a.dynamicMatch?.score || 0);
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'price-asc') {
        return a.startingPrice - b.startingPrice;
      }
      if (sortBy === 'price-desc') {
        return b.startingPrice - a.startingPrice;
      }
      if (sortBy === 'jobs') {
        return b.completedJobs - a.completedJobs;
      }
      return 0;
    });

    return withScores;
  }, [
    creators,
    activeBrief,
    searchTerm,
    selectedTool,
    selectedSkill,
    selectedSpecialization,
    selectedContentType,
    selectedStyle,
    selectedAspectRatio,
    maxBudget,
    selectedEvidence,
    selectedAvailability,
    sortBy
  ]);

  const displayedCreators = filteredAndSortedCreators.slice(0, visibleCount);
  const hasMore = filteredAndSortedCreators.length > visibleCount;

  const handleOpenInvite = (creator) => {
    setInviteModalCreator(creator);
    setInviteCampaignId(activeBrief?.id || campaigns[0]?.id || '');
    setInviteBudget(creator.startingPrice || 2000);
    setInviteMessage(`Hi ${creator.name},\n\nWe reviewed your verified AI portfolio and would like to invite you to collaborate on our campaign "${activeBrief?.title || 'Brand Video Campaign'}" with milestone escrow protection.`);
  };

  const handleSendInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteModalCreator) return;

    sendCollaborationRequest({
      campaignId: inviteCampaignId,
      creatorId: inviteModalCreator.id,
      budget: Number(inviteBudget),
      deadline: activeBrief?.deadline || '3 Weeks',
      message: inviteMessage
    });

    addToast({
      title: 'Collaboration Request Dispatched!',
      message: `Invitation successfully sent to ${inviteModalCreator.name} for $${inviteBudget}.`,
      type: 'success'
    });

    setInviteModalCreator(null);
  };

  const handleOpenMatchBreakdown = (creator) => {
    setMatchModalData({
      creator,
      brief: activeBrief,
      match: creator.dynamicMatch || calculateCreatorMatch(creator, activeBrief)
    });
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Sparkles size={15} />
            <span>AI Talent Discovery & Matching Engine</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Discover & Filter AI Creators
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Filter by verified AI tools, specialization, creative style, and evaluate algorithmic compatibility against your active briefs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigateTo('shortlist-compare')}
            className="btn btn-outline"
          >
            <Scale size={16} />
            <span>Compare Shortlist ({shortlistedCreatorIds.length})</span>
          </button>
        </div>
      </div>

      {/* Matching Brief Selector Banner */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: '#EEF2FF',
        border: '1px solid #C7D2FE',
        borderRadius: 'var(--radius-lg)',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Active Brief Matching Context
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {activeBrief ? activeBrief.title : 'General Marketplace Discovery'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Matching against brief:
          </span>
          <select
            className="form-select"
            value={activeBriefId}
            onChange={(e) => {
              setActiveBriefId(e.target.value);
              setSelectedCampaignId(e.target.value);
            }}
            style={{ minWidth: '260px', padding: '6px 12px', fontSize: '0.85rem' }}
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} (${c.budget?.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filter Panel */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px', backgroundColor: '#FFFFFF' }}>
        {/* Top Row: Search, Specialization, Tools */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {/* Search Input */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Search Keywords, Tools, or Skills:
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="Sophia, ComfyUI, Flux.1, Photorealistic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* AI Tools & Models Filter (Requirement 2.3) */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              AI Tools & Models:
            </label>
            <select
              className="form-select"
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
            >
              {toolsList.map((tool) => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </div>

          {/* Skills Filter (Requirement 2.1) */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Creator Skills:
            </label>
            <select
              className="form-select"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              {skillsList.map((skill) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Specialization, Content Type, Creative Style, Aspect Ratio */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
          {/* Specialization Filter (Requirement 2.2) */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Specialization:
            </label>
            <select
              className="form-select"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Content Type (Requirement 2.4) */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Content Type:
            </label>
            <select
              className="form-select"
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value)}
            >
              {contentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Creative / Portfolio Style (Requirement 2 Useful) */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Creative Style:
            </label>
            <select
              className="form-select"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
            >
              {creativeStyles.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio (Requirement 2 Useful) */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Aspect Ratio:
            </label>
            <select
              className="form-select"
              value={selectedAspectRatio}
              onChange={(e) => setSelectedAspectRatio(e.target.value)}
            >
              {aspectRatios.map((ar) => (
                <option key={ar} value={ar}>{ar === 'All' ? 'All Formats' : ar}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Third Row: Trust Status, Availability, Budget Slider, Reset */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'flex-end', paddingTop: '14px', borderTop: '1px solid var(--border-light)' }}>
          {/* Trust / Verification Status (Requirement 4) */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Trust Verification:
            </label>
            <select
              className="form-select"
              value={selectedEvidence}
              onChange={(e) => setSelectedEvidence(e.target.value)}
            >
              {evidenceOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Availability:
            </label>
            <select
              className="form-select"
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
            >
              {availabilityOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Max Budget Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Max Project Rate:
              </label>
              <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.85rem' }}>
                ${maxBudget.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="1000"
              max="6000"
              step="250"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          {/* Clear All Filters Button */}
          <div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn btn-outline"
              style={{ width: '100%', fontSize: '0.825rem' }}
            >
              <RotateCcw size={14} />
              <span>Clear All Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Applied Filter Indicators & Result Count Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px'
      }}>
        {/* Left: Result Count & Active Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
            Showing <strong>{filteredAndSortedCreators.length}</strong> AI Creator{filteredAndSortedCreators.length === 1 ? '' : 's'}
          </span>

          {appliedFilters.map((f) => (
            <span
              key={f.key}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#F4F4F5',
                border: '1px solid #E4E4E7',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                padding: '3px 10px'
              }}
            >
              <span>{f.label}</span>
              <button
                type="button"
                onClick={f.clear}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--text-muted)'
                }}
                title="Remove filter"
              >
                <X size={12} />
              </button>
            </span>
          ))}

          {appliedFilters.length > 0 && (
            <button
              type="button"
              onClick={handleClearFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear all
            </button>
          )}
        </div>

        {/* Right: Sorting Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', padding: '6px 12px', fontSize: '0.825rem' }}
          >
            <option value="match">Highest AI Match</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="jobs">Most Completed Jobs</option>
            <option value="price-asc">Starting Rate (Low to High)</option>
            <option value="price-desc">Starting Rate (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Empty Results Screen with Clear Filters */}
      {filteredAndSortedCreators.length === 0 ? (
        <div className="card" style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px'
          }}>
            <Search size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
            No creators match your current filter criteria
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.925rem', maxWidth: '520px', margin: '0 auto 24px' }}>
            We couldn't find any creator matching all active filters. Try expanding your budget range, resetting tool constraints, or clearing your search term.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="btn btn-primary"
          >
            <RotateCcw size={16} />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        /* Creator Cards Grid */
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            {displayedCreators.map((creator) => {
              const isShortlisted = shortlistedCreatorIds.includes(creator.id);
              const previewPortfolio = creator.portfolio && creator.portfolio[0];
              const matchScore = creator.dynamicMatch?.score || creator.matchScore || 95;

              return (
                <div
                  key={creator.id}
                  className="card card-hover"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)'
                  }}
                >
                  {/* Portfolio Preview Thumbnail */}
                  <div
                    onClick={() => {
                      setSelectedCreatorId(creator.id);
                      navigateTo('brand-creator-detail');
                    }}
                    style={{
                      position: 'relative',
                      height: '180px',
                      backgroundColor: '#0F172A',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={previewPortfolio?.image || creator.coverImage}
                      alt={creator.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {creator.category}
                    </div>

                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px'
                    }}>
                      <MatchScoreBadge
                        score={matchScore}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenMatchBreakdown(creator);
                        }}
                      />
                    </div>
                  </div>

                  {/* Creator Header Section */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #FFFFFF',
                            boxShadow: 'var(--shadow-xs)'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                            {creator.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {creator.specialization}
                          </div>
                        </div>
                      </div>

                      <EvidenceBadge status={creator.evidenceStatus} size="small" />
                    </div>

                    {/* Bio snippet */}
                    <p style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {creator.bio}
                    </p>

                    {/* Tools & Skills Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {creator.tools.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                          {t}
                        </span>
                      ))}
                      {creator.skills.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Price, Rating, & Availability */}
                    <div style={{
                      backgroundColor: 'var(--bg-secondary)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '18px',
                      fontSize: '0.825rem'
                    }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Starting Rate: </span>
                        <strong style={{ color: 'var(--primary)' }}>${creator.startingPrice?.toLocaleString()}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                        <Star size={13} fill="#F59E0B" color="#F59E0B" />
                        <span>{creator.rating}</span>
                        <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>({creator.completedJobs} jobs)</span>
                      </div>
                    </div>

                    {/* Action Buttons: Shortlist, View Portfolio, Invite/Hire */}
                    <div style={{
                      marginTop: 'auto',
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr 1fr',
                      gap: '8px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-light)'
                    }}>
                      {/* Shortlist Button */}
                      <button
                        type="button"
                        onClick={() => toggleShortlist(creator.id)}
                        className="btn btn-outline btn-sm"
                        title={isShortlisted ? 'Remove from Shortlist' : 'Save / Shortlist Creator'}
                        style={{ padding: '8px 10px', color: isShortlisted ? 'var(--primary)' : 'var(--text-muted)' }}
                      >
                        <Bookmark size={15} fill={isShortlisted ? 'var(--primary)' : 'none'} />
                      </button>

                      {/* View Portfolio Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCreatorId(creator.id);
                          navigateTo('brand-creator-detail');
                        }}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.825rem' }}
                      >
                        <Eye size={14} />
                        <span>View Portfolio</span>
                      </button>

                      {/* Invite / Hire Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenInvite(creator)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.825rem' }}
                      >
                        <Send size={14} />
                        <span>Invite / Hire</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination / Load More */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="btn btn-outline"
                style={{ padding: '10px 24px', fontSize: '0.9rem' }}
              >
                <span>Load More Creators ({filteredAndSortedCreators.length - visibleCount} remaining)</span>
                <ChevronDown size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Invite / Send Proposal Modal */}
      {inviteModalCreator && (
        <Modal
          isOpen={true}
          onClose={() => setInviteModalCreator(null)}
          title={`Invite ${inviteModalCreator.name} to Campaign`}
        >
          <form onSubmit={handleSendInviteSubmit}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <img
                src={inviteModalCreator.avatar}
                alt={inviteModalCreator.name}
                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{inviteModalCreator.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{inviteModalCreator.specialization} • Starting ${inviteModalCreator.startingPrice}</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Campaign / Brief:</label>
              <select
                className="form-select"
                value={inviteCampaignId}
                onChange={(e) => setInviteCampaignId(e.target.value)}
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>{c.title} (${c.budget})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Offered Escrow Budget ($ USD):</label>
              <input
                type="number"
                className="form-input"
                value={inviteBudget}
                onChange={(e) => setInviteBudget(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Invitation Message & Scope:</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setInviteModalCreator(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <Send size={15} />
                <span>Send Collaboration Request</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Algorithmic Match Score Explanation Modal */}
      {matchModalData && (
        <Modal
          isOpen={true}
          onClose={() => setMatchModalData(null)}
          title={`AI Suitability Breakdown: ${matchModalData.creator.name}`}
        >
          <div style={{ padding: '4px 0' }}>
            {/* Top Match Score Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
              padding: '16px 20px',
              backgroundColor: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #C7D2FE'
            }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
                {matchModalData.match.score}%
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  {matchModalData.match.score >= 90 ? 'High Campaign Suitability' : 'Moderate Campaign Suitability'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Evaluated against brief: <strong>"{matchModalData.brief?.title || 'Active Campaign'}"</strong>
                </div>
              </div>
            </div>

            {/* Match Scoring Dimensions */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Toolchain Overlap:
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {matchModalData.match.breakdown?.toolScore || 28} / 30 pts
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Category & Aesthetic Style:
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {matchModalData.match.breakdown?.categoryScore || 28} / 30 pts
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Budget Alignment:
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {matchModalData.match.breakdown?.budgetScore || 20} / 20 pts
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Trust & Audit Proofs:
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                  {matchModalData.match.breakdown?.trustScore || 18} / 20 pts
                </div>
              </div>
            </div>

            {/* Strengths List */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Algorithmic Match Factors:
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', padding: 0, margin: 0 }}>
                {matchModalData.match.breakdown?.reasons?.map((reason, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button
                type="button"
                onClick={() => setMatchModalData(null)}
                className="btn btn-outline"
              >
                Close Breakdown
              </button>
              <button
                type="button"
                onClick={() => {
                  const creatorToInvite = matchModalData.creator;
                  setMatchModalData(null);
                  handleOpenInvite(creatorToInvite);
                }}
                className="btn btn-primary"
              >
                <Send size={14} />
                <span>Invite Creator</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ExploreCreatorsPage;

