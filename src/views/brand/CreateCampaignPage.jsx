import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  Sparkles,
  PlusCircle,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Calendar,
  Layers,
  FileText,
  Send,
  Building2,
  Video,
  ShieldCheck,
  Globe,
  Sliders,
  Check,
  X,
  HelpCircle,
  Lock,
  Plus,
  Trash2
} from 'lucide-react';

export const CreateCampaignPage = () => {
  const {
    campaigns,
    addCampaign,
    updateCampaign,
    navigateTo,
    brandProfile,
    selectedCampaignId,
    setSelectedCampaignId,
    addToast
  } = useApp();

  // Check if we are in Edit mode
  const existingCampaign = selectedCampaignId
    ? campaigns.find((c) => c.id === selectedCampaignId)
    : null;

  const [formData, setFormData] = useState({
    title: '',
    brandName: brandProfile?.name || 'Aura Luxe Fine Jewellery',
    description: '',
    objective: '',
    targetAudience: 'Tech enthusiasts, luxury consumers, and digital trendsetters aged 20-45',
    contentType: 'AI Video',
    creativeStyle: 'Photorealistic',
    customStyleNote: '',
    outputFormat: 'MP4',
    customFormatNote: '',
    aspectRatio: '16:9',
    customAspectRatioNote: '',
    duration: '30 Seconds (+ 2x 15s cuts)',
    requiredTools: ['Flux.1 Pro', 'ComfyUI', 'Runway Gen-3'],
    customToolInput: '',
    deliverables: [
      '1x 30s Master 4K Video Ad',
      '2x 15s Vertical Social Cuts (9:16)',
      '5x 8K Static Hero Stills',
      'Trained Brand LoRA weights archive'
    ],
    newDeliverableInput: '',
    budget: 4800,
    deadline: '2026-11-28',
    timeline: '3 Weeks from assignment',
    revisionRequirements: '2 rounds of minor pacing and color grading adjustments included',
    // 11. Commercial-use requirements
    isCommercialRequired: true,
    licensingScope: 'Full Commercial Global Buyout',
    intendedPlatforms: ['Instagram', 'TikTok', 'YouTube', 'Meta Ads', 'Web Storefront'],
    ownershipTerms: 'Client owns final rendered deliverables; Creator retains moral rights and portfolio showcase rights; Custom LoRA model weights transfer upon final milestone release',
    unresolvedLicensingNotes: 'No unresolved third-party IP questions. All generative inputs must use licensed or custom trained checkpoints.'
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Load existing campaign data if editing
  useEffect(() => {
    if (existingCampaign) {
      setFormData({
        title: existingCampaign.title || '',
        brandName: existingCampaign.brandName || brandProfile?.name || '',
        description: existingCampaign.description || '',
        objective: existingCampaign.objective || '',
        targetAudience: existingCampaign.targetAudience || 'Luxury consumers and digital trendsetters aged 20-45',
        contentType: existingCampaign.contentCategory?.includes('Video') ? 'AI Video' :
                     existingCampaign.contentCategory?.includes('Animation') ? 'AI Animation' :
                     existingCampaign.contentCategory?.includes('Fashion') ? 'AI Images' :
                     existingCampaign.contentCategory || 'AI Video',
        creativeStyle: existingCampaign.creativeStyle || 'Photorealistic',
        customStyleNote: '',
        outputFormat: existingCampaign.format || 'MP4',
        customFormatNote: '',
        aspectRatio: existingCampaign.aspectRatio || '16:9',
        customAspectRatioNote: '',
        duration: existingCampaign.duration || '30 Seconds',
        requiredTools: existingCampaign.requiredTools || ['Flux.1 Pro', 'ComfyUI'],
        customToolInput: '',
        deliverables: Array.isArray(existingCampaign.deliverables)
          ? existingCampaign.deliverables
          : typeof existingCampaign.deliverables === 'string'
          ? existingCampaign.deliverables.split(',').map((d) => d.trim())
          : ['1x 30s Master 4K Video Ad', '5x 8K Stills'],
        newDeliverableInput: '',
        budget: existingCampaign.budget || 4800,
        deadline: existingCampaign.deadline || '2026-11-28',
        timeline: existingCampaign.timeline || '3 Weeks',
        revisionRequirements: existingCampaign.revisionRequirements || '2 rounds of minor adjustments',
        isCommercialRequired: true,
        licensingScope: existingCampaign.usageRights || 'Full Commercial Global Buyout',
        intendedPlatforms: ['Instagram', 'TikTok', 'YouTube', 'Meta Ads'],
        ownershipTerms: 'Client owns final deliverables upon escrow payout',
        unresolvedLicensingNotes: 'None'
      });
    }
  }, [selectedCampaignId]);

  // Kampus.VC Standard Options
  const contentTypes = ['AI Video', 'AI Animation', 'AI Images', 'Graphics', 'Other'];
  const creativeStyles = ['Cinematic', 'Photorealistic', '3D', 'Anime', 'Minimalist', 'Futuristic', 'Custom style'];
  const outputFormats = ['MP4', 'PNG', 'JPG', 'WebP', 'Other supported formats'];
  const aspectRatios = ['16:9', '9:16', '1:1', '4:5', 'Custom'];
  const availableToolPresets = ['Flux.1 Pro', 'ComfyUI', 'Runway Gen-3', 'OpenAI Sora', 'Midjourney v6.1', 'Kling AI', 'Blender 4.2', 'Magnific AI', 'Topaz Video AI', 'ElevenLabs'];
  const licensingScopes = [
    'Full Commercial Global Buyout',
    'Perpetual Digital Advertising & Paid Social',
    'Digital Social Media & Organic Web Only',
    'Broadcast TV & Theatrical Distribution',
    'Exclusive Category Buyout (12 Months)'
  ];
  const platformOptions = ['Instagram', 'TikTok', 'YouTube', 'Meta Ads', 'TV Broadcast', 'Web Storefront', 'Billboard / OOH'];

  // Toggle tool chip
  const toggleTool = (tool) => {
    if (formData.requiredTools.includes(tool)) {
      setFormData({ ...formData, requiredTools: formData.requiredTools.filter((t) => t !== tool) });
    } else {
      setFormData({ ...formData, requiredTools: [...formData.requiredTools, tool] });
    }
  };

  // Add custom tool
  const addCustomTool = () => {
    if (formData.customToolInput.trim() && !formData.requiredTools.includes(formData.customToolInput.trim())) {
      setFormData({
        ...formData,
        requiredTools: [...formData.requiredTools, formData.customToolInput.trim()],
        customToolInput: ''
      });
    }
  };

  // Toggle platform chip
  const togglePlatform = (plat) => {
    if (formData.intendedPlatforms.includes(plat)) {
      setFormData({ ...formData, intendedPlatforms: formData.intendedPlatforms.filter((p) => p !== plat) });
    } else {
      setFormData({ ...formData, intendedPlatforms: [...formData.intendedPlatforms, plat] });
    }
  };

  // Add deliverable item
  const addDeliverable = () => {
    if (formData.newDeliverableInput.trim()) {
      setFormData({
        ...formData,
        deliverables: [...formData.deliverables, formData.newDeliverableInput.trim()],
        newDeliverableInput: ''
      });
    }
  };

  const removeDeliverable = (idx) => {
    setFormData({
      ...formData,
      deliverables: formData.deliverables.filter((_, i) => i !== idx)
    });
  };

  // Mandatory Field Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Campaign title is required';
    if (!formData.description.trim()) errors.description = 'Campaign description and detailed requirements are required';
    if (!formData.objective.trim()) errors.objective = 'Campaign goals/objective is required';
    if (!formData.targetAudience.trim()) errors.targetAudience = 'Target audience is required';
    if (!formData.contentType) errors.contentType = 'Content type selection is required';
    if (!formData.creativeStyle) errors.creativeStyle = 'Creative style selection is required';
    if (!formData.outputFormat) errors.outputFormat = 'Output format is required';
    if (!formData.aspectRatio) errors.aspectRatio = 'Aspect ratio is required';
    if (!formData.deliverables || formData.deliverables.length === 0) errors.deliverables = 'At least 1 campaign deliverable is required';
    if (!formData.budget || Number(formData.budget) <= 0) errors.budget = 'Please enter a valid escrow budget (minimum $100)';
    if (!formData.deadline) errors.deadline = 'Campaign deadline is required';
    if (formData.isCommercialRequired && !formData.licensingScope.trim()) {
      errors.licensingScope = 'Please define the required commercial licensing scope';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle Publish / Save
  const handlePublish = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast({
        title: 'Validation Incomplete',
        message: 'Please resolve all required fields highlighted in red.',
        type: 'error'
      });
      return;
    }

    const payload = {
      title: formData.title,
      brandName: formData.brandName,
      description: formData.description,
      objective: formData.objective,
      targetAudience: formData.targetAudience,
      contentCategory: formData.contentType,
      creativeStyle: formData.creativeStyle === 'Custom style' ? formData.customStyleNote || 'Custom Style' : formData.creativeStyle,
      format: formData.outputFormat === 'Other supported formats' ? formData.customFormatNote || 'Other' : formData.outputFormat,
      aspectRatio: formData.aspectRatio === 'Custom' ? formData.customAspectRatioNote || 'Custom' : formData.aspectRatio,
      duration: formData.duration,
      requiredTools: formData.requiredTools,
      requiredSkills: ['Macro Lighting', 'Temporal Coherence', 'Prompt Engineering', 'Color Grading'],
      deliverables: formData.deliverables,
      budget: Number(formData.budget),
      deadline: formData.deadline,
      timeline: formData.timeline,
      revisionRequirements: formData.revisionRequirements,
      isCommercialRequired: formData.isCommercialRequired,
      licensingScope: formData.licensingScope,
      intendedPlatforms: formData.intendedPlatforms,
      ownershipTerms: formData.ownershipTerms,
      unresolvedLicensingNotes: formData.unresolvedLicensingNotes,
      status: 'Active'
    };

    if (existingCampaign) {
      updateCampaign(existingCampaign.id, payload);
      addToast({
        title: 'Creative Brief Updated!',
        message: `"${formData.title}" has been updated and published.`,
        type: 'success'
      });
    } else {
      addCampaign(payload);
      addToast({
        title: 'Creative Brief Published!',
        message: `"${formData.title}" is now active and accepting creator proposals.`,
        type: 'success'
      });
    }

    setSelectedCampaignId(null);
    navigateTo('my-campaigns');
  };

  // Handle Save Draft
  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      setValidationErrors({ title: 'Please provide at least a campaign title to save as draft.' });
      return;
    }

    const payload = {
      title: formData.title,
      brandName: formData.brandName,
      description: formData.description,
      objective: formData.objective || 'Draft Objective',
      targetAudience: formData.targetAudience,
      contentCategory: formData.contentType,
      creativeStyle: formData.creativeStyle,
      format: formData.outputFormat,
      aspectRatio: formData.aspectRatio,
      duration: formData.duration,
      requiredTools: formData.requiredTools,
      deliverables: formData.deliverables,
      budget: Number(formData.budget) || 2500,
      deadline: formData.deadline || '2026-12-01',
      timeline: formData.timeline,
      revisionRequirements: formData.revisionRequirements,
      isCommercialRequired: formData.isCommercialRequired,
      licensingScope: formData.licensingScope,
      intendedPlatforms: formData.intendedPlatforms,
      ownershipTerms: formData.ownershipTerms,
      status: 'Draft'
    };

    if (existingCampaign) {
      updateCampaign(existingCampaign.id, payload);
    } else {
      addCampaign(payload);
    }

    addToast({
      title: 'Draft Saved',
      message: 'Creative brief saved to Drafts.',
      type: 'info'
    });

    setSelectedCampaignId(null);
    navigateTo('my-campaigns');
  };

  return (
    <div className="page-content animate-fade-in" style={{ maxWidth: '1080px', paddingBottom: '80px' }}>
      {/* Top Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => {
            setSelectedCampaignId(null);
            navigateTo('my-campaigns');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to My Briefs</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#71717A',
              marginBottom: '4px'
            }}>
              <FileText size={14} color="#09090B" />
              <span>{existingCampaign ? 'EDIT CREATIVE BRIEF' : 'NEW PROCUREMENT BRIEF'}</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 850, margin: 0, color: '#09090B', letterSpacing: '-0.03em' }}>
              {existingCampaign ? 'Edit Campaign Brief' : 'Define Brand / Agency Brief'}
            </h1>
            <p style={{ color: '#71717A', fontSize: '0.95rem', marginTop: '4px' }}>
              Specify content types, styles, formats, aspect ratios, tools, deliverables, and commercial rights.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => navigateTo('ai-brief-builder')}
              className="btn btn-outline"
              style={{ fontSize: '0.85rem' }}
            >
              <Sparkles size={14} color="#7C3AED" />
              <span>Use AI Brief Builder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Campaign Brief Form */}
      <form onSubmit={handlePublish}>
        
        {/* 1. CAMPAIGN OVERVIEW, TITLE & GOALS */}
        <div className="card" style={{ marginBottom: '24px', backgroundColor: '#FFFFFF', padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 850, marginBottom: '20px', color: '#09090B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="#09090B" />
            <span>1. Campaign Overview, Goals & Target Audience</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Campaign Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Aura Luxe 30s Instagram Jewellery Commercial Suite"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {validationErrors.title && (
                <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' }}>{validationErrors.title}</div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Brand / Agency Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Aura Luxe Fine Jewellery"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Campaign Description & Detailed Requirements *</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe the campaign creative vision, key scene sequences, brand mood, and technical execution expectations..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            {validationErrors.description && (
              <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' }}>{validationErrors.description}</div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Campaign Goals & KPIs *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Launch Q4 collection, drive 4.5% CTR on Reels, highlight macro refraction"
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              />
              {validationErrors.objective && (
                <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' }}>{validationErrors.objective}</div>
              )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Target Audience *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Luxury jewellery buyers & trendsetters aged 22-45"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              />
              {validationErrors.targetAudience && (
                <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' }}>{validationErrors.targetAudience}</div>
              )}
            </div>
          </div>
        </div>


        {/* 2. CONTENT TYPE, STYLE, FORMAT & ASPECT RATIO (MANDATORY KAMPUS.VC FIELDS) */}
        <div className="card" style={{ marginBottom: '24px', backgroundColor: '#FFFFFF', padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 850, marginBottom: '20px', color: '#09090B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Video size={18} color="#7C3AED" />
            <span>2. Content Type, Creative Style, Output Format & Aspect Ratio</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '18px' }}>
            {/* Content Type */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Content Type *</label>
              <select
                className="form-select"
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              >
                {contentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Creative Style */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Creative Style *</label>
              <select
                className="form-select"
                value={formData.creativeStyle}
                onChange={(e) => setFormData({ ...formData, creativeStyle: e.target.value })}
              >
                {creativeStyles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            {/* Output Format */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Output Format *</label>
              <select
                className="form-select"
                value={formData.outputFormat}
                onChange={(e) => setFormData({ ...formData, outputFormat: e.target.value })}
              >
                {outputFormats.map((fmt) => (
                  <option key={fmt} value={fmt}>{fmt}</option>
                ))}
              </select>
            </div>

            {/* Aspect Ratio */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Aspect Ratio *</label>
              <select
                className="form-select"
                value={formData.aspectRatio}
                onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
              >
                {aspectRatios.map((ar) => (
                  <option key={ar} value={ar}>{ar}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional Custom inputs */}
          {(formData.creativeStyle === 'Custom style' || formData.outputFormat === 'Other supported formats' || formData.aspectRatio === 'Custom') && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '18px', padding: '14px', backgroundColor: '#FAFAFA', borderRadius: '12px', border: '1px solid #E4E4E7' }}>
              {formData.creativeStyle === 'Custom style' && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Custom Style Specifications</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Cyber-editorial with volumetric lighting"
                    value={formData.customStyleNote}
                    onChange={(e) => setFormData({ ...formData, customStyleNote: e.target.value })}
                  />
                </div>
              )}
              {formData.outputFormat === 'Other supported formats' && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Custom Output Format</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. ProRes 4444 XQ / OpenEXR Sequence"
                    value={formData.customFormatNote}
                    onChange={(e) => setFormData({ ...formData, customFormatNote: e.target.value })}
                  />
                </div>
              )}
              {formData.aspectRatio === 'Custom' && (
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Custom Aspect Ratio / Resolution</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 21:9 Ultra-widescreen or 3840x1080"
                    value={formData.customAspectRatioNote}
                    onChange={(e) => setFormData({ ...formData, customAspectRatioNote: e.target.value })}
                  />
                </div>
              )}
            </div>
          )}

          {/* Required AI Tools & Models */}
          <div className="form-group" style={{ marginTop: '14px', marginBottom: 0 }}>
            <label className="form-label">Required / Preferred AI Tools & Checkpoints</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              {availableToolPresets.map((tool) => {
                const isSelected = formData.requiredTools.includes(tool);
                return (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className={`prompt-pill ${isSelected ? 'active' : ''}`}
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  >
                    {isSelected && <Check size={12} />}
                    <span>{tool}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Tool Adder */}
            <div style={{ display: 'flex', gap: '8px', maxWidth: '420px' }}>
              <input
                type="text"
                className="form-input"
                style={{ padding: '7px 12px', fontSize: '0.85rem' }}
                placeholder="Add custom tool (e.g. ControlNet, Luma)"
                value={formData.customToolInput}
                onChange={(e) => setFormData({ ...formData, customToolInput: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTool(); } }}
              />
              <button
                type="button"
                onClick={addCustomTool}
                className="btn btn-outline btn-sm"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>


        {/* 3. DELIVERABLES, BUDGET & TIMELINE */}
        <div className="card" style={{ marginBottom: '24px', backgroundColor: '#FFFFFF', padding: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 850, marginBottom: '20px', color: '#09090B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <DollarSign size={18} color="#059669" />
            <span>3. Campaign Deliverables, Escrow Budget & Timeline</span>
          </h2>

          {/* Deliverables Checklist */}
          <div className="form-group">
            <label className="form-label">Itemized Deliverables Checklist *</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              {formData.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    backgroundColor: '#FAFAFA',
                    border: '1px solid #E4E4E7',
                    fontSize: '0.88rem',
                    color: '#09090B'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={15} color="#10B981" />
                    <span>{item}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDeliverable(idx)}
                    style={{ background: 'none', border: 'none', color: '#71717A', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Deliverable Input */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 1x 30s Master 4K Video Ad, 2x 10s Social Variations..."
                value={formData.newDeliverableInput}
                onChange={(e) => setFormData({ ...formData, newDeliverableInput: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDeliverable(); } }}
              />
              <button
                type="button"
                onClick={addDeliverable}
                className="btn btn-outline"
                style={{ whiteSpace: 'nowrap' }}
              >
                <Plus size={15} />
                <span>Add Deliverable</span>
              </button>
            </div>
            {validationErrors.deliverables && (
              <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' }}>{validationErrors.deliverables}</div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Escrow Budget ($ USD) *</label>
              <input
                type="number"
                className="form-input"
                placeholder="4800"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
              {validationErrors.budget && (
                <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' }}>{validationErrors.budget}</div>
              )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Target Completion Deadline *</label>
              <input
                type="date"
                className="form-input"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
              {validationErrors.deadline && (
                <div style={{ color: '#EF4444', fontSize: '0.78rem', marginTop: '4px' }}>{validationErrors.deadline}</div>
              )}
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Revision Iterations Allowed</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2 rounds of pacing & color tweaks"
                value={formData.revisionRequirements}
                onChange={(e) => setFormData({ ...formData, revisionRequirements: e.target.value })}
              />
            </div>
          </div>
        </div>


        {/* 4. COMMERCIAL-USE, LICENSING & OWNERSHIP (MANDATORY KAMPUS.VC REQUIREMENTS) */}
        <div className="card" style={{ marginBottom: '32px', backgroundColor: '#FFFFFF', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 850, margin: 0, color: '#09090B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#10B981" />
              <span>4. Commercial-Use Requirements & Licensing Scope</span>
            </h2>
            <span className="badge badge-verified" style={{ fontSize: '0.72rem' }}>
              Audit Compliant
            </span>
          </div>

          {/* Is Commercial Use Required */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '12px',
            backgroundColor: '#FAFAFA',
            border: '1px solid #E4E4E7',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#09090B' }}>
                Is Commercial-Use License Required?
              </div>
              <div style={{ fontSize: '0.8rem', color: '#71717A', marginTop: '2px' }}>
                Declares whether the final creative deliverables will be deployed for paid marketing, products, or commercial broadcast.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isCommercialRequired: true })}
                className={`prompt-pill ${formData.isCommercialRequired ? 'active' : ''}`}
                style={{ padding: '6px 18px', fontSize: '0.82rem' }}
              >
                Yes, Commercial Buyout
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isCommercialRequired: false })}
                className={`prompt-pill ${!formData.isCommercialRequired ? 'active' : ''}`}
                style={{ padding: '6px 18px', fontSize: '0.82rem' }}
              >
                No, Editorial / Spec Only
              </button>
            </div>
          </div>

          {/* Licensing Scope Dropdown */}
          <div className="form-group">
            <label className="form-label">Required Licensing & Usage Scope *</label>
            <select
              className="form-select"
              value={formData.licensingScope}
              onChange={(e) => setFormData({ ...formData, licensingScope: e.target.value })}
            >
              {licensingScopes.map((scope) => (
                <option key={scope} value={scope}>{scope}</option>
              ))}
            </select>
          </div>

          {/* Intended Platforms Multi-select */}
          <div className="form-group">
            <label className="form-label">Intended Distribution Platforms</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {platformOptions.map((plat) => {
                const isSelected = formData.intendedPlatforms.includes(plat);
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => togglePlatform(plat)}
                    className={`prompt-pill ${isSelected ? 'active' : ''}`}
                    style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  >
                    {isSelected && <Check size={12} />}
                    <span>{plat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ownership and permission declarations */}
          <div className="form-group">
            <label className="form-label">Ownership & Permission Declarations</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={formData.ownershipTerms}
              onChange={(e) => setFormData({ ...formData, ownershipTerms: e.target.value })}
              placeholder="e.g. Client owns final raster deliverables; Creator retains portfolio display rights..."
            />
          </div>

          {/* Unresolved licensing questions */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Unresolved Licensing / Legal Questions (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={formData.unresolvedLicensingNotes}
              onChange={(e) => setFormData({ ...formData, unresolvedLicensingNotes: e.target.value })}
              placeholder="Note any specific trademark clearances, music licensing, or actor face likeness approvals required..."
            />
          </div>
        </div>


        {/* Action Controls Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          paddingTop: '12px'
        }}>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="btn btn-outline"
            style={{ padding: '12px 24px' }}
          >
            <Save size={15} />
            <span>Save as Draft</span>
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="btn btn-dark btn-lg"
              style={{ padding: '13px 32px', fontSize: '0.95rem' }}
            >
              <Send size={16} />
              <span>{existingCampaign ? 'Save & Update Brief' : 'Publish Creative Brief'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CreateCampaignPage;
