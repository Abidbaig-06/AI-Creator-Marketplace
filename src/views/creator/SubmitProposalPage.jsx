import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  FileSpreadsheet,
  Send,
  Save,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Calendar,
  Layers,
  Building2
} from 'lucide-react';

export const SubmitProposalPage = () => {
  const {
    campaigns,
    selectedCampaignId,
    activeCreatorProfile,
    submitProposal,
    navigateTo,
    addToast
  } = useApp();

  const [targetCampaignId, setTargetCampaignId] = useState(
    selectedCampaignId || campaigns[0]?.id || ''
  );

  const selectedCamp = campaigns.find((c) => c.id === targetCampaignId) || campaigns[0];

  const [proposedBudget, setProposedBudget] = useState(selectedCamp.budget || 4800);
  const [timeline, setTimeline] = useState('3 Weeks');
  const [pitch, setPitch] = useState(
    `We can direct the master 4K video suite using our custom ComfyUI temporal coherence node setup and Flux.1 Pro LoRAs. We will deliver 2 preliminary moodboard styleframes within 48 hours and package raw generation seeds upon milestone approval.`
  );
  const [selectedPortfolioIds, setSelectedPortfolioIds] = useState(
    (activeCreatorProfile.portfolio || []).map((p) => p.id)
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitProposal({
      campaignId: targetCampaignId,
      pitch,
      proposedBudget,
      timeline,
      portfolioItems: selectedPortfolioIds
    });
    addToast({
      title: 'Proposal Sent Successfully',
      message: `Your pitch was delivered to ${selectedCamp.brandName}.`,
      type: 'success'
    });
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="page-content animate-fade-in" style={{ maxWidth: '980px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <button
          type="button"
          onClick={() => navigateTo('available-campaigns')}
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
          <span>Back to Open Briefs</span>
        </button>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Submit Campaign Proposal & Pitch
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Pitch your creative direction, ComfyUI node strategy, proposed milestones, and delivery timeline.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Campaign Selection Card */}
        <div className="card" style={{ marginBottom: '24px', backgroundColor: '#FFFFFF', padding: '24px' }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Select Open Campaign Brief</label>
          <select
            className="form-select"
            value={targetCampaignId}
            onChange={(e) => {
              setTargetCampaignId(e.target.value);
              const camp = campaigns.find((c) => c.id === e.target.value);
              if (camp) setProposedBudget(camp.budget);
            }}
          >
            {campaigns.filter((c) => c.status === 'Active').map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} • {c.brandName} (${c.budget})
              </option>
            ))}
          </select>
        </div>

        {/* Pitch Approach */}
        <div className="card" style={{ marginBottom: '32px', backgroundColor: '#FFFFFF', padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
            Creative & Technical Approach
          </h3>

          <div className="form-group">
            <label className="form-label">Cover Pitch & Toolchain Strategy</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Explain how you will achieve photorealism, temporal consistency, and brand guidelines..."
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Proposed Total Project Price ($ USD)</label>
              <input
                type="number"
                className="form-input"
                value={proposedBudget}
                onChange={(e) => setProposedBudget(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Estimated Turnaround Timeline</label>
              <input
                type="text"
                className="form-input"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button
              type="button"
              onClick={() => navigateTo('available-campaigns')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED', fontWeight: 700 }}
            >
              <Send size={15} />
              <span>Submit Formal Proposal</span>
            </button>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => {
            setIsSuccessModalOpen(false);
            navigateTo('creator-requests');
          }}
          title="Proposal Dispatched"
        >
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
              Proposal Delivered to {selectedCamp.brandName}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
              The client will review your proposed approach, rate (${proposedBudget}), and attached portfolio proofs.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigateTo('creator-requests');
              }}
              className="btn btn-primary"
              style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
            >
              View Active Proposals
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SubmitProposalPage;
