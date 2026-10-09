import React from 'react';
import { useApp } from '../../context/AppContext';
import { MatchScoreBadge } from '../../components/common/Badge';
import {
  Briefcase,
  Sparkles,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Send,
  Building2,
  FileText,
  Video,
  Layers
} from 'lucide-react';

export const CreatorCampaignDetailPage = () => {
  const {
    selectedCampaignId,
    campaigns,
    navigateTo,
    setSelectedCampaignId
  } = useApp();

  const campaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  return (
    <div className="page-content animate-fade-in" style={{ maxWidth: '980px' }}>
      {/* Back Button */}
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
        <span>Back to Explore Brand Briefs</span>
      </button>

      {/* Campaign Main Header Card */}
      <div className="card" style={{ marginBottom: '28px', padding: '28px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Building2 size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 700 }}>{campaign.brandName}</span>
              <span style={{ color: 'var(--border-light)' }}>•</span>
              <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{campaign.contentCategory}</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {campaign.title}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => navigateTo('submit-proposal', { campaignId: campaign.id })}
              className="btn btn-primary"
              style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
            >
              <Send size={15} />
              <span>Apply / Submit Proposal</span>
            </button>
          </div>
        </div>

        {/* AI Suitability Banner */}
        <div style={{
          backgroundColor: 'var(--primary-light)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px',
          border: '1px solid #C7D2FE'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem' }}>
              <Sparkles size={16} />
              <span>AI Suitability Alignment (98% Match)</span>
            </div>
            <MatchScoreBadge score={98} />
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
            Your verified ComfyUI node workflows and previous luxury product renders directly match this brief's technical specifications.
          </p>
        </div>

        {/* Objectives */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
            Campaign Objectives & Creative Brief
          </h3>
          <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {campaign.objective}
          </p>
        </div>

        {/* Target Audience & Creative Style */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', backgroundColor: 'var(--bg-secondary)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Target Audience</div>
            <div style={{ fontSize: '0.9rem', marginTop: '2px', color: 'var(--text-primary)', fontWeight: 600 }}>{campaign.targetAudience}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Creative Style & Lighting</div>
            <div style={{ fontSize: '0.9rem', marginTop: '2px', color: 'var(--text-primary)', fontWeight: 600 }}>{campaign.creativeStyle}</div>
          </div>
        </div>

        {/* Deliverables Checklist */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>
            Deliverables Package Checklist:
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            {campaign.deliverables?.map((del, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={16} color="#059669" />
                <span>{del}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Commercial Rights */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '18px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
            Commercial Rights & Licensing Scope
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            {campaign.usageRights}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatorCampaignDetailPage;
