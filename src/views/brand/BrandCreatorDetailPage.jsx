import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceBadge, MatchScoreBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Sparkles,
  Send,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ArrowLeft,
  Briefcase,
  Layers,
  FileCode2,
  Calendar,
  Award,
  DollarSign,
  TrendingUp,
  Sliders,
  Check,
  Play,
  X,
  FileText
} from 'lucide-react';

export const BrandCreatorDetailPage = () => {
  const {
    selectedCreatorId,
    creators,
    evidenceRecords,
    campaigns,
    navigateTo,
    shortlistedCreatorIds,
    toggleShortlist,
    sendCollaborationRequest,
    addToast
  } = useApp();

  const creator = creators.find((c) => c.id === selectedCreatorId) || creators[0];
  const isShortlisted = shortlistedCreatorIds.includes(creator.id);
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' | 'workflow' | 'experience' | 'terms'
  const [isCollabModalOpen, setIsCollabModalOpen] = useState(false);
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);

  // Proposal form state
  const [proposalCampaignId, setProposalCampaignId] = useState(campaigns[0]?.id || '');
  const [proposalBudget, setProposalBudget] = useState(creator.startingPrice || 2500);
  const [proposalTimeline, setProposalTimeline] = useState('3 Weeks');
  const [proposalMessage, setProposalMessage] = useState(
    `Hi ${creator.name},\n\nWe were impressed by your verified AI portfolio and workflow proofs. We would love to collaborate with you on our upcoming campaign with milestone-backed escrow protection.`
  );

  const handleSendProposal = (e) => {
    e.preventDefault();
    sendCollaborationRequest({
      campaignId: proposalCampaignId,
      creatorId: creator.id,
      budget: Number(proposalBudget),
      deadline: proposalTimeline,
      message: proposalMessage
    });
    addToast({
      title: 'Proposal Dispatched!',
      message: `Invitation successfully sent to ${creator.name}.`,
      type: 'success'
    });
    setIsCollabModalOpen(false);
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Back Navigation & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <button
          type="button"
          onClick={() => navigateTo('explore-creators')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Discover Creators</span>
        </button>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => toggleShortlist(creator.id)}
            className="btn btn-outline btn-sm"
          >
            <Bookmark size={15} fill={isShortlisted ? 'var(--primary)' : 'none'} color={isShortlisted ? 'var(--primary)' : 'currentColor'} />
            <span>{isShortlisted ? 'Shortlisted' : 'Shortlist Creator'}</span>
          </button>
          <button
            type="button"
            onClick={() => setIsCollabModalOpen(true)}
            className="btn btn-primary btn-sm"
            style={{ fontWeight: 700 }}
          >
            <Send size={15} />
            <span>Invite to Project</span>
          </button>
        </div>
      </div>

      {/* Creator Profile Header Card */}
      <div className="card" style={{ marginBottom: '28px', padding: '28px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            <img
              src={creator.avatar}
              alt={creator.name}
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #FFFFFF',
                boxShadow: 'var(--shadow-md)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {creator.name}
                </h1>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{creator.handle}</span>
                <EvidenceBadge status={creator.evidenceStatus} />
              </div>
              <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '8px' }}>
                {creator.headline}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {creator.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} /> {creator.availability}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#F59E0B' }}>
                  <Star size={14} fill="#F59E0B" /> {creator.rating} ({creator.reviewsCount} reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Match Score & Starting Price Pill */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
              Starting Rate
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1.2 }}>
              ${creator.startingPrice}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              ${creator.hourlyRate}/hr approx.
            </div>
            <div style={{ marginTop: '8px' }}>
              <MatchScoreBadge score={creator.matchScore || 98} />
            </div>
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
          {creator.bio}
        </p>

        {/* Tools & Skills Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', paddingTop: '18px', borderTop: '1px solid var(--border-light)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>
              Mastered AI Tools & Models:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {creator.tools.map((t, idx) => (
                <span key={idx} className="badge badge-indigo">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>
              Core Technical Skills:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {creator.skills.map((s, idx) => (
                <span key={idx} className="badge badge-gray">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Detail Navigation Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-light)',
        marginBottom: '28px',
        gap: '24px'
      }}>
        {[
          { id: 'portfolio', label: `AI Portfolios & Renders (${creator.portfolio?.length || 0})` },
          { id: 'workflow', label: 'Workflows & Proofs' },
          { id: 'experience', label: 'Experience & Achievements' },
          { id: 'terms', label: 'Commercial Terms & Licensing' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 4px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.925rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: AI Portfolios & Renders Grid */}
      {activeTab === 'portfolio' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {(creator.portfolio || []).map((item) => (
            <div
              key={item.id}
              className="card card-hover"
              onClick={() => setSelectedPortfolioItem(item)}
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}
            >
              <div style={{ position: 'relative', height: '220px', backgroundColor: '#0F172A' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.7rem',
                  fontWeight: 700
                }}>
                  {item.category}
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'var(--primary)',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <Play size={14} fill="currentColor" style={{ marginLeft: '2px' }} />
                </div>
              </div>

              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px', flex: 1 }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                  {item.tools.map((t, idx) => (
                    <span key={idx} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  color: '#059669',
                  backgroundColor: '#ECFDF5',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #A7F3D0'
                }}>
                  <ShieldCheck size={14} />
                  <span>{item.evidenceType}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Workflows & Node Graphs */}
      {activeTab === 'workflow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {(creator.portfolio || []).map((item) => (
            <div key={item.id} className="card" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Tools: {item.tools.join(' • ')}
                  </div>
                </div>
                <span className="badge badge-verified">
                  <ShieldCheck size={13} />
                  <span>{item.evidenceType}</span>
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '6px' }}>
                  Prompt Deconstruction & Seeds:
                </div>
                <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)', wordBreak: 'break-word', fontFamily: 'monospace' }}>
                  "{item.promptSummary}"
                </code>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Cryptographic Workflow Hash: <strong>#0x8a92f...c3d</strong></span>
                <button
                  type="button"
                  onClick={() => setSelectedPortfolioItem(item)}
                  className="btn btn-outline btn-sm"
                >
                  <span>Inspect Full Node Graph</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Experience & Previous Work */}
      {activeTab === 'experience' && (
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px', color: 'var(--text-primary)' }}>
            Track Record & Past Client Work
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                Sephora & Velora Paris Commercial Campaign
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Lead Generative Art Director • 2025
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Delivered 12x 8K photorealistic product renders and 4x 30-second fluid dynamics commercials with full brand LoRA weights.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '16px' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                AI International Short Film Festival
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Best Visual Direction Award • 2025
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Awarded for temporal consistency across 18 generative scenes using Sora and ComfyUI.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Commercial Terms & Licensing */}
      {activeTab === 'terms' && (
        <div className="card" style={{ padding: '28px', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '18px', color: 'var(--text-primary)' }}>
            Commercial Rights & Deliverable Terms
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Commercial Rights
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                {creator.usageTerms?.commercialRights || 'Full Global Commercial Buyout Included'}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Model Weights & LoRAs
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                {creator.usageTerms?.modelWeights || 'Trained Brand LoRA weights delivered upon completion'}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                Category Exclusivity
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '4px' }}>
                {creator.usageTerms?.exclusivity || 'Available upon request (+20% fee)'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Item Detail Modal */}
      {selectedPortfolioItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPortfolioItem(null)}
          title={selectedPortfolioItem.title}
        >
          <div style={{ padding: '4px 0' }}>
            <div style={{ width: '100%', height: '300px', backgroundColor: '#0F172A', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '18px' }}>
              <img
                src={selectedPortfolioItem.image}
                alt={selectedPortfolioItem.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Generation Description & Creative Workflow:
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '4px' }}>
                {selectedPortfolioItem.description}
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                Verified Generation Prompt:
              </div>
              <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                "{selectedPortfolioItem.promptSummary}"
              </code>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-verified">
                <ShieldCheck size={14} />
                <span>{selectedPortfolioItem.evidenceType}</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  setSelectedPortfolioItem(null);
                  setIsCollabModalOpen(true);
                }}
                className="btn btn-primary"
              >
                <Send size={15} />
                <span>Invite to Project</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Send Proposal / Invitation Modal */}
      {isCollabModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsCollabModalOpen(false)}
          title={`Invite ${creator.name} to Project`}
        >
          <form onSubmit={handleSendProposal}>
            <div className="form-group">
              <label className="form-label">Select Campaign Brief:</label>
              <select
                className="form-select"
                value={proposalCampaignId}
                onChange={(e) => setProposalCampaignId(e.target.value)}
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
                value={proposalBudget}
                onChange={(e) => setProposalBudget(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project Timeline / Delivery Target:</label>
              <input
                type="text"
                className="form-input"
                value={proposalTimeline}
                onChange={(e) => setProposalTimeline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Invitation Pitch & Deliverables Summary:</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setIsCollabModalOpen(false)}
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
    </div>
  );
};

export default BrandCreatorDetailPage;
