import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchScoreBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Compass,
  Search,
  Sparkles,
  Bookmark,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  Send,
  Building2,
  CheckCircle2,
  Filter,
  RotateCcw
} from 'lucide-react';

export const AvailableCampaignsPage = () => {
  const { campaigns, navigateTo, setSelectedCampaignId, sendCollaborationRequest, activeCreatorProfile, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedContentType, setSelectedContentType] = useState('All');
  const [minBudget, setMinBudget] = useState(0);
  const [savedCampaignIds, setSavedCampaignIds] = useState([]);

  // Proposal modal state
  const [applyModalCampaign, setApplyModalCampaign] = useState(null);
  const [proposedRate, setProposedRate] = useState(4500);
  const [proposedTimeline, setProposedTimeline] = useState('3 Weeks');
  const [coverNote, setCoverNote] = useState('');

  const activeCampaigns = campaigns.filter((c) => c.status === 'Active');

  const categories = [
    'All',
    'Commercial Video',
    '3D Animation',
    'Product Visuals',
    'AI Film',
    'Virtual Influencer',
    'Social Video & UGC'
  ];

  const skillsList = [
    'All',
    'Fluid Simulation',
    'Photorealistic Product Lighting',
    'Voice Narration',
    'Custom LoRA Training',
    'Temporal Coherence'
  ];

  const filteredCampaigns = useMemo(() => {
    return activeCampaigns.filter((c) => {
      const matchesSearch =
        !searchTerm.trim() ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.requiredTools.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All' || c.contentCategory?.toLowerCase().includes(selectedCategory.toLowerCase());

      const matchesSkill =
        selectedSkill === 'All' || c.requiredSkills?.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase()));

      const matchesBudget = c.budget >= minBudget;

      return matchesSearch && matchesCategory && matchesSkill && matchesBudget;
    });
  }, [activeCampaigns, searchTerm, selectedCategory, selectedSkill, minBudget]);

  const toggleSaveCampaign = (campId) => {
    setSavedCampaignIds((prev) =>
      prev.includes(campId) ? prev.filter((id) => id !== campId) : [...prev, campId]
    );
  };

  const handleOpenApply = (camp) => {
    setApplyModalCampaign(camp);
    setProposedRate(camp.budget);
    setCoverNote(
      `Hi ${camp.brandName} team,\n\nI reviewed your brief for "${camp.title}" and would love to deliver this project using my verified ${activeCreatorProfile.tools[0]} and ${activeCreatorProfile.tools[1]} workflows with full commercial buyout.`
    );
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!applyModalCampaign) return;

    sendCollaborationRequest({
      campaignId: applyModalCampaign.id,
      creatorId: activeCreatorProfile.id,
      budget: Number(proposedRate),
      deadline: proposedTimeline,
      message: coverNote
    });

    addToast({
      title: 'Proposal Submitted!',
      message: `Your proposal for "${applyModalCampaign.title}" has been sent to ${applyModalCampaign.brandName}.`,
      type: 'success'
    });

    setApplyModalCampaign(null);
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Compass size={15} />
            <span>Marketplace Procurement Briefs</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Explore Brand Briefs & Opportunities
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Browse funded brand campaigns, inspect creative requirements, and submit competitive proposals with milestone escrow.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: '28px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          {/* Keyword Search */}
          <div style={{ position: 'relative' }}>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Search Briefs:
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="Search jewellery, ComfyUI, 3D..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Project Category:
            </label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Required Skills Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Required Skills:
            </label>
            <select
              className="form-select"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              {skillsList.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Min Budget Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Min Budget: ${minBudget}
            </label>
            <input
              type="range"
              min="0"
              max="6000"
              step="500"
              value={minBudget}
              onChange={(e) => setMinBudget(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredCampaigns.map((camp) => {
          const isSaved = savedCampaignIds.includes(camp.id);

          return (
            <div
              key={camp.id}
              className="card card-hover"
              style={{ padding: '24px', backgroundColor: '#FFFFFF', position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Building2 size={15} color="var(--primary)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 }}>{camp.brandName}</span>
                    <span style={{ color: 'var(--border-light)' }}>•</span>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                      {camp.contentCategory}
                    </span>
                  </div>
                  <h2
                    onClick={() => {
                      setSelectedCampaignId(camp.id);
                      navigateTo('creator-campaign-detail');
                    }}
                    style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, cursor: 'pointer', color: 'var(--text-primary)' }}
                  >
                    {camp.title}
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MatchScoreBadge score={98} />
                  <button
                    type="button"
                    onClick={() => toggleSaveCampaign(camp.id)}
                    className="btn btn-outline btn-sm"
                    title={isSaved ? 'Saved' : 'Save Brief'}
                  >
                    <Bookmark size={14} fill={isSaved ? 'var(--primary)' : 'none'} color={isSaved ? 'var(--primary)' : 'currentColor'} />
                  </button>
                </div>
              </div>

              {/* Brief Objective */}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                {camp.objective}
              </p>

              {/* Style & Specs Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', backgroundColor: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.825rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Creative Style: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{camp.creativeStyle}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Commercial Rights: </span>
                  <strong style={{ color: 'var(--text-primary)' }}>{camp.usageRights || 'Full Buyout'}</strong>
                </div>
              </div>

              {/* Required Tools & Skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                {camp.requiredTools.map((t, idx) => (
                  <span key={idx} className="badge badge-gray" style={{ fontSize: '0.72rem' }}>
                    {t}
                  </span>
                ))}
                {camp.requiredSkills?.map((s, idx) => (
                  <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Budget, Deadline & Action Buttons (Prompt Requirement: View Details, Apply Now) */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Escrow Budget: </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)' }}>${camp.budget}</span>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Deadline: <strong>{camp.deadline}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCampaignId(camp.id);
                      navigateTo('creator-campaign-detail');
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye size={14} />
                    <span>View Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenApply(camp)}
                    className="btn btn-primary btn-sm"
                    style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
                  >
                    <Send size={14} />
                    <span>Apply Now</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Apply / Proposal Modal */}
      {applyModalCampaign && (
        <Modal
          isOpen={true}
          onClose={() => setApplyModalCampaign(null)}
          title={`Submit Proposal for ${applyModalCampaign.title}`}
        >
          <form onSubmit={handleApplySubmit}>
            <div style={{ padding: '12px 14px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '18px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Client: {applyModalCampaign.brandName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Client Budget: ${applyModalCampaign.budget} • Target Deadline: {applyModalCampaign.deadline}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Proposed Escrow Rate ($ USD):</label>
                <input
                  type="number"
                  className="form-input"
                  value={proposedRate}
                  onChange={(e) => setProposedRate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Timeline:</label>
                <input
                  type="text"
                  className="form-input"
                  value={proposedTimeline}
                  onChange={(e) => setProposedTimeline(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Proposal Cover Pitch & Technical Workflow Approach:</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setApplyModalCampaign(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
              >
                <Send size={15} />
                <span>Submit Proposal</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AvailableCampaignsPage;
