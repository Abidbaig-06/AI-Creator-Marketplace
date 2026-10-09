import React from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceBadge, MatchScoreBadge } from '../../components/common/Badge';
import {
  Sparkles,
  TrendingUp,
  Inbox,
  Compass,
  FolderKanban,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Edit,
  DollarSign,
  Clock,
  Eye,
  Lock,
  Upload,
  Check,
  FileText,
  Briefcase,
  Star,
  Award,
  Zap,
  Building2
} from 'lucide-react';

export const CreatorDashboardPage = () => {
  const {
    activeCreatorProfile,
    campaigns,
    collaborationRequests,
    projects,
    evidenceRecords,
    navigateTo,
    setSelectedCampaignId,
    setSelectedProjectId
  } = useApp();

  const myEngagements = projects.filter((p) => p.creatorId === activeCreatorProfile.id || p.id === 'proj-101');
  const myRequests = collaborationRequests.filter((r) => r.creatorId === activeCreatorProfile.id || r.type === 'Brand Invitation');
  const openCampaigns = campaigns.filter((c) => c.status === 'Active');

  const incomingInvitations = collaborationRequests.filter(
    (r) => (r.creatorId === activeCreatorProfile.id || r.type === 'Brand Invitation') && r.status === 'Incoming'
  );

  return (
    <div className="page-content animate-fade-in">
      {/* SaaS Welcome Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              <Award size={14} />
              <span>Verified Generative Artist Studio</span>
            </div>
            <h1 style={{ fontSize: '1.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
              Welcome back, {activeCreatorProfile.name || 'Sophia Chan'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '3px' }}>
              Level 2 Verified AI Creator • Your ComfyUI workflow claims perform in the <strong>top 2% platform-wide</strong>.
            </p>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigateTo('available-campaigns')}
              className="btn btn-primary"
              style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED', gap: '6px' }}
            >
              <Compass size={14} />
              <span>Explore Brand Briefs</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('portfolio-manager')}
              className="btn btn-outline"
              style={{ gap: '6px' }}
            >
              <Sparkles size={14} color="#7C3AED" />
              <span>Manage Portfolio</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('creator-requests')}
              className="btn btn-outline"
              style={{ gap: '6px' }}
            >
              <Inbox size={14} />
              <span>Invitations ({incomingInvitations.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Completion Readiness Bar */}
      <div className="card" style={{ padding: '18px 22px', marginBottom: '28px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <ShieldCheck size={17} color="#059669" />
            <span>Profile Verification Readiness Score:</span>
            <span style={{ color: '#059669' }}>95% Complete</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            1 more C2PA manifest to unlock Elite Platinum Creator Tier
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '999px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ width: '95%', height: '100%', background: 'linear-gradient(90deg, #6366F1 0%, #059669 100%)', borderRadius: '999px' }} />
        </div>

        {/* Status Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="badge badge-verified"><span className="badge-dot" style={{ backgroundColor: '#059669' }}></span> 14 Claims Verified</span>
            <span className="badge badge-indigo"><span className="badge-dot" style={{ backgroundColor: '#6366F1' }}></span> ComfyUI Node Graph Linked</span>
            <span className="badge badge-gray">✓ Commercial Buyout Terms Active</span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('evidence-verification')}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.78rem' }}
          >
            <span>Evidence Center</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* 4 SaaS Creator Metric Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Card 1: Portfolio Projects */}
        <div
          className="stat-card"
          onClick={() => navigateTo('portfolio-manager')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-label">
            <span>Portfolio Renders</span>
            <Sparkles size={16} color="#7C3AED" />
          </div>
          <div className="stat-value">
            {activeCreatorProfile.portfolio?.length || 4}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>projects</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <span className="stat-trend positive">
              ✓ All Lineage Audited
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>100% C2PA</span>
          </div>
        </div>

        {/* Card 2: Received Invitations */}
        <div
          className="stat-card"
          onClick={() => navigateTo('creator-requests')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-label">
            <span>Inbound Invitations</span>
            <Inbox size={16} color="#D97706" />
          </div>
          <div className="stat-value">
            {myRequests.length}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>total</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <span className="stat-trend positive" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
              <Clock size={12} /> {incomingInvitations.length} pending
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>1-click accept</span>
          </div>
        </div>

        {/* Card 3: Submitted Proposals */}
        <div
          className="stat-card"
          onClick={() => navigateTo('creator-requests')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-label">
            <span>Active Proposals</span>
            <FileSpreadsheet size={16} color="var(--primary)" />
          </div>
          <div className="stat-value">
            3
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>submitted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <span className="stat-trend neutral">
              Under Review
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>Avg 94% match</span>
          </div>
        </div>

        {/* Card 4: Active Escrow Collaborations */}
        <div
          className="stat-card"
          onClick={() => navigateTo('creator-projects')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-label">
            <span>Active Client Projects</span>
            <FolderKanban size={16} color="#059669" />
          </div>
          <div className="stat-value">
            {myEngagements.length}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>milestones</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <span className="stat-trend positive">
              <ShieldCheck size={12} /> $9,200 Secured
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>Escrow funded</span>
          </div>
        </div>
      </div>

      {/* Grid: Open Opportunities & Incoming Brief Requests */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Left: Recent Funded Brand Briefs */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass size={15} color="#7C3AED" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Funded Brand Briefs
                </h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '2px 0 0' }}>
                Verified brands seeking your generative video & 3D stack
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('available-campaigns')}
              className="btn btn-ghost btn-sm"
              style={{ color: '#7C3AED', fontWeight: 600 }}
            >
              <span>Explore All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {openCampaigns.slice(0, 3).map((camp) => (
              <div
                key={camp.id}
                onClick={() => {
                  setSelectedCampaignId(camp.id);
                  navigateTo('creator-campaign-detail');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-xs)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#DDD6FE';
                  e.currentTarget.style.backgroundColor = 'var(--secondary-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <Building2 size={13} color="var(--primary)" />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{camp.brandName}</span>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>{camp.contentCategory}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                    {camp.title}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    ${camp.budget?.toLocaleString()}
                  </div>
                  <MatchScoreBadge score={98} size="small" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Inbound Collaboration Invitations */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Inbox size={15} color="#D97706" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Direct Client Invitations
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('creator-requests')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              <span>Manage All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {req.brandName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {req.campaignTitle}
                    </div>
                  </div>
                  <span className="badge badge-pending" style={{ fontSize: '0.68rem' }}>
                    {req.status}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {req.offeredAmount || '$3,000'}
                  </div>
                  <button
                    onClick={() => navigateTo('creator-requests')}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    Review & Respond
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboardPage;
