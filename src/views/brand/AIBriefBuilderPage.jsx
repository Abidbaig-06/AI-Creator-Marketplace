import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchScoreBadge, EvidenceBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  synthesizeBriefFromIdea,
  calculateDeterministicRecommendations
} from '../../services/aiBriefAgent';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Edit3,
  Send,
  Check,
  Building2,
  Video,
  Search,
  Filter,
  X,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Eye,
  Info,
  Award,
  FileText
} from 'lucide-react';

export const AIBriefBuilderPage = () => {
  const {
    creators,
    addCampaign,
    navigateTo,
    addNotification,
    addToast,
    brandProfile
  } = useApp();

  // -------------------------------------------------------------
  // SECTION 1: AI-Assisted Brief Builder State
  // -------------------------------------------------------------
  const [promptInput, setPromptInput] = useState(
    'I am launching a futuristic smart water bottle for fitness enthusiasts. I want an exciting marketing campaign targeting young professionals.'
  );

  const samplePresets = [
    {
      title: 'Smart Water Bottle (Kampus.VC Demo)',
      prompt:
        'I am launching a futuristic smart water bottle for fitness enthusiasts. I want an exciting marketing campaign targeting young professionals.'
    },
    {
      title: 'Luxury Diamond Jewellery',
      prompt:
        'I own a fine jewellery brand and need a 30-second luxury AI advertisement for Instagram highlighting diamond refraction and gold reflections.'
    },
    {
      title: 'Digital Techwear Lookbook',
      prompt:
        'Produce a virtual runway video for an autumn techwear apparel collection with reflective rain shaders, cyber aesthetics and 8 distinct looks.'
    }
  ];

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [structuredBrief, setStructuredBrief] = useState(() =>
    synthesizeBriefFromIdea(
      'I am launching a futuristic smart water bottle for fitness enthusiasts. I want an exciting marketing campaign targeting young professionals.',
      brandProfile
    )
  );
  const [isEditing, setIsEditing] = useState(false);
  const [briefConfirmed, setBriefConfirmed] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);

  // References for smooth scrolling
  const briefSpecsRef = useRef(null);
  const recommendationsRef = useRef(null);
  const discoveryRef = useRef(null);

  // -------------------------------------------------------------
  // SECTION 3: Creator Search & Filtering State
  // -------------------------------------------------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedTool, setSelectedTool] = useState('All');
  const [selectedContentType, setSelectedContentType] = useState('All');
  const [selectedTrustTier, setSelectedTrustTier] = useState('All');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('All');
  const [maxBudget, setMaxBudget] = useState(6000);

  // Invite modal state
  const [inviteModalCreator, setInviteModalCreator] = useState(null);
  const [inviteMessage, setInviteMessage] = useState('');

  // Details modal state
  const [inspectCreatorModal, setInspectCreatorModal] = useState(null);

  // Pre-populate search filters from generated brief
  const applyBriefFiltersToDiscovery = (brief) => {
    if (!brief) return;
    if (brief.suggestedTools && brief.suggestedTools.length > 0) {
      const firstMatchingTool = brief.suggestedTools[0];
      setSelectedTool(firstMatchingTool);
    }
    if (brief.contentType) {
      setSelectedContentType(brief.contentType);
    }
    if (brief.creativeStyle) {
      setSelectedStyle(brief.creativeStyle);
    }
    if (brief.aspectRatio) {
      setSelectedAspectRatio(brief.aspectRatio);
    }
  };

  // -------------------------------------------------------------
  // SECTION 1 & 6: AI Generation Trigger
  // -------------------------------------------------------------
  const handleGenerateBrief = () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setGenerationStep(1);
    setShowNotificationBanner(false);
    setBriefConfirmed(false);

    // Multi-stage realistic agent synthesis progression
    setTimeout(() => setGenerationStep(2), 350);
    setTimeout(() => setGenerationStep(3), 700);
    setTimeout(() => setGenerationStep(4), 1050);

    setTimeout(() => {
      const generated = synthesizeBriefFromIdea(promptInput, brandProfile);
      setStructuredBrief(generated);
      setIsGenerating(false);
      setGenerationStep(5);
      setIsEditing(false);
      setShowNotificationBanner(true);

      // Auto-apply brief filters to Section 3 discovery
      applyBriefFiltersToDiscovery(generated);

      // Persist in Brand Hub notification inbox (Section 6)
      if (addNotification) {
        addNotification('brand', {
          title: 'Your AI Campaign Brief Is Ready!',
          message: `Campaign brief "${generated.title}" generated with verified creator recommendations.`,
          type: 'success',
          actionUrl: 'ai-brief-builder'
        });
      }

      addToast({
        title: 'Campaign Brief Synthesized',
        message: 'Structured brief validated with Zod and matched with verified AI creators.',
        type: 'success'
      });

      // Smooth scroll to completion notification / brief specs
      if (briefSpecsRef.current) {
        briefSpecsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1400);
  };

  // -------------------------------------------------------------
  // SECTION 2: Brief Actions (Save Draft, Confirm, Publish)
  // -------------------------------------------------------------
  const handleSaveDraft = () => {
    if (!structuredBrief) return;
    addCampaign({
      title: structuredBrief.title,
      description: structuredBrief.description,
      objective: structuredBrief.campaignObjectives,
      targetAudience: structuredBrief.targetAudience,
      contentCategory: structuredBrief.contentType,
      creativeStyle: structuredBrief.creativeStyle,
      aspectRatio: structuredBrief.aspectRatio,
      duration: structuredBrief.duration,
      deliverables: structuredBrief.deliverables,
      requiredTools: structuredBrief.suggestedTools,
      budget: structuredBrief.budgetConfirmation?.value || 3500,
      timeline: structuredBrief.timelineConfirmation?.duration || '3 Weeks',
      isCommercialRequired: structuredBrief.isCommercialRequired,
      licensingScope: structuredBrief.usageRightsScope,
      ownershipTerms: structuredBrief.ownershipLicensingRequirements,
      status: 'Draft'
    });
    addToast({
      title: 'Brief Saved as Draft',
      message: 'Draft brief saved to My Briefs. You can review or edit it anytime.',
      type: 'info'
    });
  };

  const handleConfirmBrief = () => {
    setBriefConfirmed(true);
    setIsEditing(false);
    addToast({
      title: 'Brief Confirmed!',
      message: 'Campaign brief parameters confirmed by Brand CEO. Ready for publishing.',
      type: 'success'
    });
  };

  const handlePublishBrief = () => {
    if (!structuredBrief) return;
    addCampaign({
      title: structuredBrief.title,
      description: structuredBrief.description,
      objective: structuredBrief.campaignObjectives,
      targetAudience: structuredBrief.targetAudience,
      contentCategory: structuredBrief.contentType,
      creativeStyle: structuredBrief.creativeStyle,
      aspectRatio: structuredBrief.aspectRatio,
      duration: structuredBrief.duration,
      deliverables: structuredBrief.deliverables,
      requiredTools: structuredBrief.suggestedTools,
      budget: structuredBrief.budgetConfirmation?.value || 4500,
      timeline: structuredBrief.timelineConfirmation?.duration || '3 Weeks',
      isCommercialRequired: structuredBrief.isCommercialRequired,
      licensingScope: structuredBrief.usageRightsScope,
      ownershipTerms: structuredBrief.ownershipLicensingRequirements,
      status: 'Active'
    });
    navigateTo('my-campaigns');
  };

  // -------------------------------------------------------------
  // SECTION 5: Deterministic Recommendations Calculation
  // -------------------------------------------------------------
  const recommendedCreators = useMemo(() => {
    if (!structuredBrief) return [];
    return calculateDeterministicRecommendations(structuredBrief, creators).slice(0, 3);
  }, [structuredBrief, creators]);

  // -------------------------------------------------------------
  // SECTION 3: Creator Discovery Filter Calculation
  // -------------------------------------------------------------
  const allTools = useMemo(() => {
    const set = new Set();
    creators.forEach((c) => c.tools?.forEach((t) => set.add(t)));
    return ['All', ...Array.from(set)];
  }, [creators]);

  const allSkills = useMemo(() => {
    const set = new Set();
    creators.forEach((c) => c.skills?.forEach((s) => set.add(s)));
    return ['All', ...Array.from(set)];
  }, [creators]);

  const allSpecializations = useMemo(() => {
    const set = new Set();
    creators.forEach((c) => c.specialization && set.add(c.specialization));
    return ['All', ...Array.from(set).slice(0, 8)];
  }, [creators]);

  const filteredDiscoveryCreators = useMemo(() => {
    return creators.filter((creator) => {
      // 1. Search text
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = creator.name.toLowerCase().includes(q);
        const matchesBio = (creator.bio || '').toLowerCase().includes(q);
        const matchesSpec = (creator.specialization || '').toLowerCase().includes(q);
        const matchesTools = creator.tools?.some((t) => t.toLowerCase().includes(q));
        const matchesSkills = creator.skills?.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesBio && !matchesSpec && !matchesTools && !matchesSkills) {
          return false;
        }
      }

      // 2. Skill filter
      if (selectedSkill !== 'All') {
        const hasSkill = creator.skills?.some(
          (s) => s.toLowerCase() === selectedSkill.toLowerCase()
        );
        if (!hasSkill) return false;
      }

      // 3. Tool filter
      if (selectedTool !== 'All') {
        const hasTool = creator.tools?.some(
          (t) => t.toLowerCase().includes(selectedTool.toLowerCase()) ||
                 selectedTool.toLowerCase().includes(t.toLowerCase())
        );
        if (!hasTool) return false;
      }

      // 4. Specialization filter
      if (selectedSpecialization !== 'All') {
        if (!creator.specialization?.toLowerCase().includes(selectedSpecialization.toLowerCase())) {
          return false;
        }
      }

      // 5. Content Type filter
      if (selectedContentType !== 'All') {
        const qCat = selectedContentType.toLowerCase();
        const cCat = (creator.category || '').toLowerCase();
        const cSpec = (creator.specialization || '').toLowerCase();
        if (!cCat.includes(qCat) && !cSpec.includes(qCat)) {
          return false;
        }
      }

      // 6. Trust Tier filter
      if (selectedTrustTier !== 'All') {
        if (selectedTrustTier === 'verified' && creator.evidenceStatus !== 'verified') {
          return false;
        }
        if (selectedTrustTier === 'evidence-linked' && creator.evidenceStatus !== 'evidence-linked' && creator.evidenceStatus !== 'under-review') {
          return false;
        }
        if (selectedTrustTier === 'self-reported' && creator.evidenceStatus === 'verified') {
          return false;
        }
      }

      // 7. Budget filter
      if (creator.startingPrice > maxBudget) {
        return false;
      }

      // 8. Style filter
      if (selectedStyle !== 'All') {
        const qStyle = selectedStyle.toLowerCase();
        const cHeadline = (creator.headline || '').toLowerCase();
        const cBio = (creator.bio || '').toLowerCase();
        const cSpec = (creator.specialization || '').toLowerCase();
        if (!cHeadline.includes(qStyle) && !cBio.includes(qStyle) && !cSpec.includes(qStyle)) {
          return false;
        }
      }

      return true;
    });
  }, [
    creators,
    searchTerm,
    selectedSkill,
    selectedTool,
    selectedSpecialization,
    selectedContentType,
    selectedTrustTier,
    selectedStyle,
    maxBudget
  ]);

  const activeFiltersCount = [
    selectedSkill !== 'All',
    selectedSpecialization !== 'All',
    selectedTool !== 'All',
    selectedContentType !== 'All',
    selectedTrustTier !== 'All',
    selectedStyle !== 'All',
    selectedAspectRatio !== 'All',
    maxBudget < 6000,
    searchTerm.trim().length > 0
  ].filter(Boolean).length;

  const handleClearAllFilters = () => {
    setSearchTerm('');
    setSelectedSkill('All');
    setSelectedSpecialization('All');
    setSelectedTool('All');
    setSelectedContentType('All');
    setSelectedTrustTier('All');
    setSelectedStyle('All');
    setSelectedAspectRatio('All');
    setSelectedAvailability('All');
    setMaxBudget(6000);
  };

  return (
    <div className="page-content animate-fade-in" style={{ maxWidth: '1160px', margin: '0 auto', paddingBottom: '80px' }}>
      {/* ------------------------------------------------------------------ */}
      {/* PAGE HEADER */}
      {/* ------------------------------------------------------------------ */}
      <div style={{ marginBottom: '28px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F5F3FF',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            color: '#7C3AED',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '12px',
            border: '1px solid #EDE9FE'
          }}
        >
          <Sparkles size={15} />
          <span>KAMPUS.VC OFFICIAL — ALL-IN-ONE BRIEF BUILDER & DISCOVERY ENGINE</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          AI Brief Builder & Creator Intelligence
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', maxWidth: '880px', lineHeight: 1.5 }}>
          Describe your vision in plain English. CreatorProof AI synthesizes complete 5-pillar campaign requirements, marks unconfirmed items for confirmation, calculates explainable creator compatibility, and connects you directly with verified creators.
        </p>

        {/* Quick-Jump Section Anchor Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => briefSpecsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            <FileText size={13} />
            <span>1. Campaign Brief Specs</span>
          </button>
          <button
            type="button"
            onClick={() => recommendationsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            <Sparkles size={13} color="#7C3AED" />
            <span>2. Best AI Creators</span>
          </button>
          <button
            type="button"
            onClick={() => discoveryRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="btn btn-outline btn-sm"
            style={{ fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
          >
            <Search size={13} />
            <span>3. Search & Filter Creators</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1 — AI-ASSISTED BRIEF BUILDER */}
      {/* ------------------------------------------------------------------ */}
      <div className="card" style={{ marginBottom: '32px', backgroundColor: '#FFFFFF', border: '1.5px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <Cpu size={14} />
              <span>Section 1 — AI-Assisted Brief Builder</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '4px 0 0', color: 'var(--text-primary)' }}>
              Turn Your Idea Into a Complete Campaign
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '5px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }}></span>
            <span>Meta Llama Engine Active (Structured JSON + Zod)</span>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '16px', lineHeight: 1.5 }}>
          Enter a rough marketing concept. You do not need technical production jargon — AI synthesizes visual style, aspect ratios, deliverables, AI toolchains, commercial buyout terms, and verified creator matches automatically.
        </p>

        {/* Sample Idea Quick-Select Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            Try Sample Idea:
          </span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPromptInput(preset.prompt)}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.78rem', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-full)', borderColor: promptInput === preset.prompt ? '#7C3AED' : 'var(--border-light)' }}
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* CEO Natural Language Textarea */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="e.g. I am launching a futuristic smart water bottle for fitness enthusiasts. I want an exciting marketing campaign targeting young professionals."
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            style={{ fontSize: '1rem', lineHeight: 1.5, padding: '14px 16px', borderColor: '#D4D4D8' }}
          />
        </div>

        {/* Multi-Step Synthesis Progress (When Generating) */}
        {isGenerating && (
          <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#F5F3FF', borderRadius: 'var(--radius-md)', border: '1px solid #DDD6FE' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <RefreshCw size={18} className="animate-spin" color="#7C3AED" />
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#6D28D9' }}>
                Autonomous AI Agent Synthesizing Campaign Requirements...
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: generationStep >= 1 ? '#059669' : 'var(--text-muted)', fontWeight: 600 }}>
                {generationStep >= 1 ? <CheckCircle2 size={14} /> : <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid currentColor', display: 'inline-block' }} />}
                <span>1. Decomposing Objective & Audience</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: generationStep >= 2 ? '#059669' : 'var(--text-muted)', fontWeight: 600 }}>
                {generationStep >= 2 ? <CheckCircle2 size={14} /> : <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid currentColor', display: 'inline-block' }} />}
                <span>2. Mapping Formats & Toolchain</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: generationStep >= 3 ? '#059669' : 'var(--text-muted)', fontWeight: 600 }}>
                {generationStep >= 3 ? <CheckCircle2 size={14} /> : <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid currentColor', display: 'inline-block' }} />}
                <span>3. Structuring Commercial Terms</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: generationStep >= 4 ? '#059669' : 'var(--text-muted)', fontWeight: 600 }}>
                {generationStep >= 4 ? <CheckCircle2 size={14} /> : <span style={{ width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid currentColor', display: 'inline-block' }} />}
                <span>4. Zod Schema & Creator Matching</span>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button & Safety Note */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} color="#7C3AED" />
            <span>Never invents confirmed budgets or dates. Missing critical parameters marked for confirmation.</span>
          </div>

          <button
            type="button"
            onClick={handleGenerateBrief}
            disabled={isGenerating || !promptInput.trim()}
            className="btn btn-primary"
            style={{ fontWeight: 800, padding: '12px 28px', fontSize: '0.98rem', borderRadius: 'var(--radius-full)' }}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Synthesizing Brief...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate My Campaign Brief</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 6 — COMPLETION NOTIFICATION BANNER */}
      {/* ------------------------------------------------------------------ */}
      {showNotificationBanner && structuredBrief && (
        <div
          className="animate-fade-in"
          style={{
            backgroundColor: '#ECFDF5',
            border: '1.5px solid #A7F3D0',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#065F46', marginBottom: '2px' }}>
                Your AI Campaign Brief Is Ready!
              </div>
              <div style={{ fontSize: '0.92rem', color: '#047857' }}>
                We've found creators matching your campaign requirements. All 5 Kampus.VC pillars generated and verified.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => briefSpecsRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-outline btn-sm"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#10B981', color: '#065F46', fontWeight: 700 }}
            >
              <FileText size={14} />
              <span>Review Generated Brief</span>
            </button>
            <button
              type="button"
              onClick={() => recommendationsRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-primary btn-sm"
              style={{ backgroundColor: '#059669', borderColor: '#059669', color: '#FFFFFF', fontWeight: 700 }}
            >
              <Sparkles size={14} />
              <span>View Recommended Creators</span>
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2 — BRAND / AGENCY BRIEFS (5 KAMPUS.VC PILLARS) */}
      {/* ------------------------------------------------------------------ */}
      {structuredBrief && (
        <div ref={briefSpecsRef} style={{ marginBottom: '40px' }}>
          {/* Action Toolbar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              padding: '16px 22px',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--border-light)',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-sm)',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-indigo" style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
                Section 2 — Brand / Agency Brief
              </span>
              {briefConfirmed ? (
                <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700 }}>
                  <CheckCircle2 size={13} />
                  <span>Brief Confirmed by CEO</span>
                </span>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  All AI values are editable. Confirm before publishing.
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-outline btn-sm"
                style={{ fontWeight: 700 }}
              >
                <Edit3 size={14} />
                <span>{isEditing ? 'Done Editing' : 'Edit Brief'}</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateBrief}
                disabled={isGenerating}
                className="btn btn-outline btn-sm"
                title="Regenerate brief suggestions"
              >
                <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
                <span>Regenerate Suggestions</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="btn btn-outline btn-sm"
              >
                <Save size={14} />
                <span>Save Draft</span>
              </button>

              {!briefConfirmed && (
                <button
                  type="button"
                  onClick={handleConfirmBrief}
                  className="btn btn-outline btn-sm"
                  style={{ borderColor: '#10B981', color: '#047857', fontWeight: 700 }}
                >
                  <Check size={14} />
                  <span>Confirm Brief</span>
                </button>
              )}

              <button
                type="button"
                onClick={handlePublishBrief}
                className="btn btn-primary btn-sm"
                style={{ fontWeight: 800, padding: '8px 18px', backgroundColor: 'var(--primary)' }}
              >
                <Send size={14} />
                <span>Publish Brief</span>
              </button>
            </div>
          </div>

          {/* Unconfirmed Warning Alert if critical fields need confirmation */}
          {structuredBrief.unconfirmedFields && structuredBrief.unconfirmedFields.length > 0 && (
            <div
              style={{
                backgroundColor: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}
            >
              <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#B45309' }}>
                  Critical Information Requiring Confirmation:
                </div>
                <div style={{ fontSize: '0.825rem', color: '#92400E', marginTop: '4px' }}>
                  {structuredBrief.unconfirmedFields.map((field, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span>•</span>
                      <span>{field}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5-Pillar Structured Brief Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
            {/* PILLAR 1: CAMPAIGN REQUIREMENTS */}
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1.5px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Building2 size={18} color="#7C3AED" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  1. Campaign Requirements
                </h3>
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Campaign Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={structuredBrief.title}
                      onChange={(e) => setStructuredBrief({ ...structuredBrief, title: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Campaign Objectives</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={structuredBrief.campaignObjectives}
                      onChange={(e) => setStructuredBrief({ ...structuredBrief, campaignObjectives: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Campaign Description</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={structuredBrief.description}
                      onChange={(e) => setStructuredBrief({ ...structuredBrief, description: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Target Audience</label>
                    <input
                      type="text"
                      className="form-input"
                      value={structuredBrief.targetAudience}
                      onChange={(e) => setStructuredBrief({ ...structuredBrief, targetAudience: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Deliverables (comma separated)</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={structuredBrief.deliverables.join('\n')}
                      onChange={(e) =>
                        setStructuredBrief({
                          ...structuredBrief,
                          deliverables: e.target.value.split('\n').filter(Boolean)
                        })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Campaign Title
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {structuredBrief.title}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Campaign Objectives
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '2px' }}>
                      {structuredBrief.campaignObjectives}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Target Audience
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {structuredBrief.targetAudience}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                      Recommended Deliverables:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {structuredBrief.deliverables.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <CheckCircle2 size={15} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PILLARS 2, 3, 4: CONTENT TYPE, STYLE, FORMAT & ASPECT RATIO */}
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1.5px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Video size={18} color="#2563EB" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  2, 3 & 4. Content Type, Style & Formats
                </h3>
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">2. Content Type</label>
                    <select
                      className="form-select"
                      value={structuredBrief.contentType}
                      onChange={(e) => setStructuredBrief({ ...structuredBrief, contentType: e.target.value })}
                    >
                      <option value="AI Video">AI Video</option>
                      <option value="AI Animation">AI Animation</option>
                      <option value="AI Images">AI Images</option>
                      <option value="AI Graphics">AI Graphics</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">3. Visual Style</label>
                    <select
                      className="form-select"
                      value={structuredBrief.creativeStyle}
                      onChange={(e) => setStructuredBrief({ ...structuredBrief, creativeStyle: e.target.value })}
                    >
                      <option value="Cinematic">Cinematic</option>
                      <option value="Photorealistic">Photorealistic</option>
                      <option value="Futuristic">Futuristic</option>
                      <option value="3D">3D</option>
                      <option value="Minimalist">Minimalist</option>
                      <option value="Anime">Anime</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">4. Format</label>
                      <select
                        className="form-select"
                        value={structuredBrief.outputFormat}
                        onChange={(e) => setStructuredBrief({ ...structuredBrief, outputFormat: e.target.value })}
                      >
                        <option value="MP4">MP4</option>
                        <option value="PNG">PNG</option>
                        <option value="JPG">JPG</option>
                        <option value="WebP">WebP</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Aspect Ratio</label>
                      <select
                        className="form-select"
                        value={structuredBrief.aspectRatio}
                        onChange={(e) => setStructuredBrief({ ...structuredBrief, aspectRatio: e.target.value })}
                      >
                        <option value="16:9">16:9 (Landscape)</option>
                        <option value="9:16">9:16 (Vertical Reels/TikTok)</option>
                        <option value="1:1">1:1 (Square Feed)</option>
                        <option value="4:5">4:5 (Portrait Feed)</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Suggested AI Tools</label>
                    <input
                      type="text"
                      className="form-input"
                      value={structuredBrief.suggestedTools.join(', ')}
                      onChange={(e) =>
                        setStructuredBrief({
                          ...structuredBrief,
                          suggestedTools: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                        })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                        2. Content Type
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                        {structuredBrief.contentType}
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                        3. Visual Style
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                        {structuredBrief.creativeStyle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                        Output Format
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                        {structuredBrief.outputFormat}
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                        Aspect Ratio
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                        {structuredBrief.aspectRatio}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                      Suggested AI Tools / Models:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {structuredBrief.suggestedTools.map((tool, idx) => (
                        <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.76rem', padding: '4px 10px' }}>
                          ⚡ {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                      Required Creator Skills:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {structuredBrief.requiredCreatorSkills.map((skill, idx) => (
                        <span key={idx} className="badge badge-gray" style={{ fontSize: '0.76rem', padding: '4px 10px', backgroundColor: 'var(--bg-secondary)' }}>
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PILLAR 5: COMMERCIAL-USE REQUIREMENTS & BUDGET CONFIRMATION */}
            <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '24px', border: '1.5px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <ShieldCheck size={18} color="#059669" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  5. Commercial-Use & Licensing Terms
                </h3>
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Commercial Use Required?</label>
                    <select
                      className="form-select"
                      value={structuredBrief.isCommercialRequired ? 'yes' : 'no'}
                      onChange={(e) =>
                        setStructuredBrief({
                          ...structuredBrief,
                          isCommercialRequired: e.target.value === 'yes'
                        })
                      }
                    >
                      <option value="yes">Yes — Commercial Rights Required</option>
                      <option value="no">No — Editorial / Non-commercial</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Usage Rights Scope</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={structuredBrief.usageRightsScope}
                      onChange={(e) => setStructuredBrief({ ...structuredBrief, usageRightsScope: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Ownership & Licensing</label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={structuredBrief.ownershipLicensingRequirements}
                      onChange={(e) =>
                        setStructuredBrief({
                          ...structuredBrief,
                          ownershipLicensingRequirements: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Estimated Budget ($ USD)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={structuredBrief.budgetConfirmation?.value || ''}
                      placeholder="e.g. 4500"
                      onChange={(e) =>
                        setStructuredBrief({
                          ...structuredBrief,
                          budgetConfirmation: {
                            ...structuredBrief.budgetConfirmation,
                            value: Number(e.target.value),
                            isConfirmed: true,
                            confirmationStatus: 'Confirmed by Brand CEO',
                            displayBudget: `$${Number(e.target.value).toLocaleString()}`
                          }
                        })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Commercial Use Required
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', fontWeight: 800, color: '#059669', fontSize: '0.92rem' }}>
                      <CheckCircle2 size={15} />
                      <span>Yes — Full Commercial Usage Required</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Intended Commercial Platforms
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                      {structuredBrief.intendedPlatforms.map((plat, idx) => (
                        <span key={idx} className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
                          {plat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Usage Rights Scope
                    </div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {structuredBrief.usageRightsScope}
                    </div>
                  </div>

                  {/* Budget & Timeline Confirmation Cards */}
                  <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Escrow Budget:</span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 900, color: structuredBrief.budgetConfirmation?.isConfirmed ? '#059669' : '#D97706' }}>
                        {structuredBrief.budgetConfirmation?.displayBudget}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: structuredBrief.budgetConfirmation?.isConfirmed ? '#059669' : '#B45309' }}>
                      {structuredBrief.budgetConfirmation?.confirmationStatus}
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Production Timeline:</span>
                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: structuredBrief.timelineConfirmation?.isConfirmed ? '#059669' : '#D97706' }}>
                        {structuredBrief.timelineConfirmation?.displayTimeline}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: structuredBrief.timelineConfirmation?.isConfirmed ? '#059669' : '#B45309' }}>
                      {structuredBrief.timelineConfirmation?.confirmationStatus}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 5 — AUTOMATIC CREATOR RECOMMENDATIONS */}
      {/* ------------------------------------------------------------------ */}
      {structuredBrief && (
        <div ref={recommendationsRef} className="card" style={{ marginBottom: '40px', backgroundColor: '#FFFFFF', padding: '26px', border: '1.5px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <Award size={15} />
                <span>Section 5 — Algorithmic Recommendations</span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '4px 0 0', color: 'var(--text-primary)' }}>
                Best AI Creators for Your Campaign
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
                Deterministic compatibility scores derived from toolchain overlap (30 pts), domain fit (30 pts), budget feasibility (20 pts), and verified audit proof (20 pts).
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {recommendedCreators.map(({ creator, score, trustTier, matchedTools, reasons, unmatchedRequirements, performance }) => (
              <div
                key={creator.id}
                style={{
                  border: '1.5px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '20px',
                  backgroundColor: 'var(--bg-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  {/* Creator Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FFFFFF' }}
                      />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--text-primary)' }}>{creator.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{creator.handle}</div>
                        <div style={{ fontSize: '0.78rem', color: '#7C3AED', fontWeight: 700 }}>{creator.specialization}</div>
                      </div>
                    </div>
                    <MatchScoreBadge score={score} />
                  </div>

                  {/* Trust Tier Signal */}
                  <div style={{ marginBottom: '12px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: creator.evidenceStatus === 'verified' ? '#ECFDF5' : '#FFFBEB',
                        color: creator.evidenceStatus === 'verified' ? '#047857' : '#B45309',
                        border: creator.evidenceStatus === 'verified' ? '1px solid #A7F3D0' : '1px solid #FDE68A'
                      }}
                    >
                      <ShieldCheck size={12} />
                      <span>{trustTier}</span>
                    </span>
                  </div>

                  {/* Why Recommended Rationale */}
                  <div style={{ marginBottom: '12px', backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                      Why Recommended:
                    </div>
                    {reasons.map((r, idx) => (
                      <div key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '2px', display: 'flex', gap: '6px' }}>
                        <span style={{ color: '#10B981', fontWeight: 800 }}>✓</span>
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* Unmatched Requirements (if any) */}
                  {unmatchedRequirements && unmatchedRequirements.length > 0 && (
                    <div style={{ marginBottom: '12px', backgroundColor: '#FFFBEB', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #FDE68A' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#B45309', fontWeight: 700, marginBottom: '2px' }}>
                        Unmatched Requirements:
                      </div>
                      {unmatchedRequirements.map((gap, idx) => (
                        <div key={idx} style={{ fontSize: '0.76rem', color: '#92400E', marginTop: '2px' }}>
                          • {gap}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matched Tools Chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                    {matchedTools.map((t, idx) => (
                      <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                        ✓ {t}
                      </span>
                    ))}
                  </div>

                  {/* Documented Performance Intelligence */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px', fontSize: '0.76rem' }}>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                      <div style={{ color: 'var(--text-muted)' }}>Experience:</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{performance.experience}</div>
                    </div>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--border-light)' }}>
                      <div style={{ color: 'var(--text-muted)' }}>Projects:</div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{performance.completedJobs}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Starting from</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      ${creator.startingPrice}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setInspectCreatorModal(creator)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <Eye size={13} />
                      <span>Audit Proof</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInviteModalCreator(creator);
                        setInviteMessage(
                          `Hi ${creator.name}, we reviewed your audited portfolio and would love to collaborate on our new campaign: "${structuredBrief.title}".`
                        );
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '0.78rem' }}
                    >
                      <span>Invite</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3 & 4 — CREATOR SEARCH, FILTERING & VERIFICATION SIGNALS */}
      {/* ------------------------------------------------------------------ */}
      <div ref={discoveryRef} className="card" style={{ backgroundColor: '#FFFFFF', padding: '26px', border: '1.5px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <Filter size={15} />
              <span>Section 3 & 4 — Creator Search & Verification Signals</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '4px 0 0', color: 'var(--text-primary)' }}>
              Discover Creators for Your Campaign
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '4px 0 0' }}>
              Filters pre-selected from your campaign brief. Search by skills, tools, specialization, and audit status.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.78rem', borderRadius: 'var(--radius-full)' }}
              >
                <X size={13} />
                <span>Clear All Filters ({activeFiltersCount})</span>
              </button>
            )}
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', backgroundColor: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: 'var(--radius-full)' }}>
              Showing {filteredDiscoveryCreators.length} of {creators.length} Creators
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '18px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search creators by name, tool (Flux, ComfyUI, Runway), skill, or aesthetic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '40px', fontSize: '0.92rem' }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Multi-Select Filter Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '18px' }}>
          {/* Tool Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              AI Tool / Model
            </label>
            <select
              className="form-select"
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              {allTools.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Specialization Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Specialization
            </label>
            <select
              className="form-select"
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              {allSpecializations.map((spec, idx) => (
                <option key={idx} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Skill Mastery
            </label>
            <select
              className="form-select"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              {allSkills.slice(0, 10).map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Content Type Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Content Type
            </label>
            <select
              className="form-select"
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="All">All Types</option>
              <option value="AI Video">AI Video</option>
              <option value="AI Animation">AI Animation</option>
              <option value="AI Images">AI Images</option>
              <option value="Product Visuals">Product Visuals</option>
            </select>
          </div>

          {/* Trust Tier Filter (Section 4) */}
          <div>
            <label className="form-label" style={{ fontSize: '0.76rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Verification Signal
            </label>
            <select
              className="form-select"
              value={selectedTrustTier}
              onChange={(e) => setSelectedTrustTier(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            >
              <option value="All">All Trust Tiers</option>
              <option value="verified">Independently Reviewed</option>
              <option value="evidence-linked">Evidence Submitted</option>
              <option value="self-reported">Self-Declared</option>
            </select>
          </div>
        </div>

        {/* Applied Filter Chips Bar */}
        {activeFiltersCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', padding: '10px 14px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Applied Filters:
            </span>
            {selectedTool !== 'All' && (
              <span className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                <span>Tool: {selectedTool}</span>
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedTool('All')} />
              </span>
            )}
            {selectedSpecialization !== 'All' && (
              <span className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                <span>Spec: {selectedSpecialization}</span>
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedSpecialization('All')} />
              </span>
            )}
            {selectedSkill !== 'All' && (
              <span className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                <span>Skill: {selectedSkill}</span>
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedSkill('All')} />
              </span>
            )}
            {selectedContentType !== 'All' && (
              <span className="badge badge-indigo" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                <span>Type: {selectedContentType}</span>
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedContentType('All')} />
              </span>
            )}
            {selectedTrustTier !== 'All' && (
              <span className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                <span>Trust: {selectedTrustTier}</span>
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedTrustTier('All')} />
              </span>
            )}
          </div>
        )}

        {/* Creator Discovery Results Grid */}
        {filteredDiscoveryCreators.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredDiscoveryCreators.map((creator) => {
              const isVerified = creator.evidenceStatus === 'verified';
              const isEvidenceLinked = creator.evidenceStatus === 'evidence-linked' || creator.evidenceStatus === 'under-review';

              return (
                <div
                  key={creator.id}
                  style={{
                    border: '1.5px solid var(--border-light)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>{creator.name}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{creator.handle}</div>
                        </div>
                      </div>
                      <EvidenceBadge status={creator.evidenceStatus} size="small" />
                    </div>

                    {/* Headline / Specialization */}
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px' }}>
                      {creator.specialization || creator.headline}
                    </div>

                    {/* Bio */}
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '12px' }}>
                      {creator.bio?.slice(0, 110)}...
                    </p>

                    {/* SECTION 4: VERIFICATION SIGNALS (3-Tier Tools & Workflows) */}
                    <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                        Production Toolchain & Evidence:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
                        {creator.tools?.slice(0, 4).map((tool, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              backgroundColor: isVerified ? '#ECFDF5' : '#F4F4F5',
                              color: isVerified ? '#047857' : 'var(--text-secondary)',
                              border: isVerified ? '1px solid #A7F3D0' : '1px solid var(--border-light)'
                            }}
                          >
                            {tool} {isVerified && '✓'}
                          </span>
                        ))}
                      </div>

                      <div style={{ fontSize: '0.74rem', color: isVerified ? '#047857' : isEvidenceLinked ? '#B45309' : 'var(--text-muted)' }}>
                        {isVerified ? (
                          <span>✓ Verified by cryptographic hash & C2PA manifest ({creator.verifiedCount || 10}+ claims)</span>
                        ) : isEvidenceLinked ? (
                          <span>⏳ Evidence submitted ({creator.evidenceCount || 4} repositories under audit)</span>
                        ) : (
                          <span>⚠️ Self-Declared (Unverified proof)</span>
                        )}
                      </div>
                    </div>

                    {/* Portfolio Highlight if available */}
                    {creator.portfolio && creator.portfolio.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <img
                          src={creator.portfolio[0].image}
                          alt={creator.portfolio[0].title}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {creator.portfolio[0].title}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {creator.portfolio[0].tools?.join(', ')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Rate starts at</div>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                        ${creator.startingPrice}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setInspectCreatorModal(creator)}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.76rem' }}
                      >
                        <ShieldCheck size={13} />
                        <span>Evidence</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInviteModalCreator(creator);
                          setInviteMessage(
                            `Hi ${creator.name}, we reviewed your profile on CreatorProof AI and would like to invite you to review our campaign brief: "${structuredBrief ? structuredBrief.title : 'New AI Campaign'}".`
                          );
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.76rem' }}
                      >
                        <span>Invite</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Results State */
          <div
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px dashed var(--border-light)'
            }}
          >
            <AlertTriangle size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-primary)' }}>
              No Creators Matched These Specific Filter Criteria
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto 18px' }}>
              Try broadening your tool selection, expanding budget, or clearing filter chips to see more verified creators.
            </p>
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 700 }}
            >
              <RefreshCw size={14} />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 1: INSPECT VERIFICATION SIGNALS & WORKFLOW AUDIT */}
      {/* ------------------------------------------------------------------ */}
      {inspectCreatorModal && (
        <Modal
          isOpen={!!inspectCreatorModal}
          onClose={() => setInspectCreatorModal(null)}
          title={`Verification Audit: ${inspectCreatorModal.name}`}
          maxWidth="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
              <img
                src={inspectCreatorModal.avatar}
                alt={inspectCreatorModal.name}
                style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{inspectCreatorModal.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inspectCreatorModal.specialization}</div>
                <div style={{ marginTop: '4px' }}>
                  <EvidenceBadge status={inspectCreatorModal.evidenceStatus} />
                </div>
              </div>
            </div>

            {/* Section 4 Signals: Verified Tools */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                1. Verified Creative Toolchain
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                {inspectCreatorModal.tools?.map((tool, idx) => (
                  <div key={idx} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-light)', backgroundColor: '#FFFFFF', fontSize: '0.82rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>⚡ {tool}</div>
                    <div style={{ fontSize: '0.72rem', color: inspectCreatorModal.evidenceStatus === 'verified' ? '#047857' : 'var(--text-muted)', marginTop: '2px' }}>
                      {inspectCreatorModal.evidenceStatus === 'verified' ? 'Independently Reviewed Proof' : 'Self-Declared Tool Proficiency'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4 Signals: Production Workflows */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                2. Documented Production Workflow
              </div>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <div style={{ marginBottom: '4px' }}>• <strong>Stage 1:</strong> Seed selection & prompt crafting via custom negative embeddings</div>
                <div style={{ marginBottom: '4px' }}>• <strong>Stage 2:</strong> High-resolution LoRA conditioning in ComfyUI / Flux.1</div>
                <div>• <strong>Stage 3:</strong> Temporal consistency smoothing and 4K upscaling via Topaz Video AI</div>
              </div>
            </div>

            {/* Section 4 Signals: Past Work Evidence */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                3. Past Work & Evidence Artifacts
              </div>
              {inspectCreatorModal.portfolio?.map((port, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginBottom: '8px' }}>
                  <img src={port.image} alt={port.title} style={{ width: '60px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{port.title}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{port.description}</div>
                    {port.evidenceLink && (
                      <a href={port.evidenceLink} target="_blank" rel="noreferrer" style={{ fontSize: '0.74rem', color: '#7C3AED', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px', textDecoration: 'none', fontWeight: 600 }}>
                        <span>Inspect Cryptographic Audit Proof</span>
                        <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
              <button
                type="button"
                onClick={() => setInspectCreatorModal(null)}
                className="btn btn-primary btn-sm"
              >
                Close Audit Inspection
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL 2: INVITE CREATOR */}
      {/* ------------------------------------------------------------------ */}
      {inviteModalCreator && (
        <Modal
          isOpen={!!inviteModalCreator}
          onClose={() => setInviteModalCreator(null)}
          title={`Invite ${inviteModalCreator.name} to Brief`}
          maxWidth="560px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <img
                src={inviteModalCreator.avatar}
                alt={inviteModalCreator.name}
                style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem' }}>{inviteModalCreator.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Starting at ${inviteModalCreator.startingPrice}</div>
              </div>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Invitation Message & Project Scope</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setInviteModalCreator(null)}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setInviteModalCreator(null);
                  addToast({
                    title: 'Invitation Dispatched!',
                    message: `Brief invitation sent to ${inviteModalCreator.name}.`,
                    type: 'success'
                  });
                }}
                className="btn btn-primary btn-sm"
                style={{ fontWeight: 800 }}
              >
                <Send size={14} />
                <span>Send Brief Invitation</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AIBriefBuilderPage;
