import React from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceBadge, MatchScoreBadge } from '../../components/common/Badge';
import {
  Briefcase,
  Users,
  Send,
  FolderKanban,
  Sparkles,
  PlusCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  Scale,
  DollarSign,
  ChevronRight,
  ExternalLink,
  Search,
  Star,
  Zap,
  MoreVertical,
  Activity
} from 'lucide-react';

export const BrandDashboardPage = () => {
  const {
    brandProfile,
    campaigns,
    creators,
    projects,
    collaborationRequests,
    shortlistedCreatorIds,
    navigateTo,
    setSelectedCreatorId,
    setSelectedCampaignId,
    setSelectedProjectId
  } = useApp();

  const activeCampaigns = campaigns.filter((c) => c.status === 'Active');
  const activeProjects = projects.filter((p) => p.status === 'In Progress' || p.status === 'Submitted' || p.status === 'Revision Requested');
  const pendingRequests = collaborationRequests.filter((r) => r.status === 'Sent' || r.status === 'Counteroffer' || r.status === 'Incoming');

  // Explainable AI Recommended Creators
  const recommendedCreators = creators.slice(0, 3);

  // Recent Activity Feed
  const recentActivities = [
    {
      id: 'act-1',
      type: 'proposal',
      title: 'New proposal received from Sophia Chan',
      subtitle: 'HydraPulse Luxury AI 30s Video Campaign ($4,500)',
      time: '15 mins ago',
      icon: <Send size={15} color="var(--primary)" />
    },
    {
      id: 'act-2',
      type: 'milestone',
      title: 'Milestone 2 deliverable ready for review',
      subtitle: 'Silk Aura Virtual Lookbook • 4K Master Video Renders',
      time: '2 hours ago',
      icon: <CheckCircle2 size={15} color="#059669" />
    },
    {
      id: 'act-3',
      type: 'brief',
      title: 'AI Brief Generated & Published',
      subtitle: 'Aura Luxe 30s Instagram Jewellery Commercial ($4,800)',
      time: '1 day ago',
      icon: <Sparkles size={15} color="#7C3AED" />
    }
  ];

  return (
    <div className="page-content animate-fade-in">
      {/* SaaS Top Welcome Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
              <ShieldCheck size={14} />
              <span>Enterprise Brand Workspace</span>
            </div>
            <h1 style={{ fontSize: '1.95rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>
              Welcome back, {brandProfile.name || 'Aura Luxe Jewels'}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '3px' }}>
              Manage generative AI creator pipelines, review verified node workflows, and audit milestone escrow releases.
            </p>
          </div>

          {/* SaaS Header Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => navigateTo('ai-brief-builder')}
              className="btn btn-outline"
              style={{ borderColor: '#C7D2FE', color: 'var(--primary)', gap: '6px' }}
            >
              <Sparkles size={14} color="var(--primary)" />
              <span>AI Brief Builder</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('explore-creators')}
              className="btn btn-outline"
              style={{ gap: '6px' }}
            >
              <Search size={14} />
              <span>Discover Creators</span>
            </button>
            <button
              type="button"
              onClick={() => navigateTo('create-campaign')}
              className="btn btn-primary"
              style={{ gap: '6px' }}
            >
              <PlusCircle size={15} />
              <span>+ New Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 SaaS Stat Metric Cards with Trend Pills */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Card 1: Total Creators Available */}
        <div
          className="stat-card"
          onClick={() => navigateTo('explore-creators')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-label">
            <span>Verified AI Creators</span>
            <Users size={16} color="var(--primary)" />
          </div>
          <div className="stat-value">
            {creators.length}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>profiles</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <span className="stat-trend positive">
              <TrendingUp size={12} /> +18.4% this week
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>100% audited</span>
          </div>
        </div>

        {/* Card 2: Active Briefs */}
        <div
          className="stat-card"
          onClick={() => navigateTo('my-campaigns')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-label">
            <span>Active Brand Briefs</span>
            <Briefcase size={16} color="#7C3AED" />
          </div>
          <div className="stat-value">
            {activeCampaigns.length}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>campaigns</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <span className="stat-trend neutral">
              {campaigns.length} lifetime briefs
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>98% match rate</span>
          </div>
        </div>

        {/* Card 3: Applications Received */}
        <div
          className="stat-card"
          onClick={() => navigateTo('brand-requests')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-label">
            <span>Applications & Inquiries</span>
            <Send size={16} color="#D97706" />
          </div>
          <div className="stat-value">
            {collaborationRequests.length}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>total</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <span className="stat-trend positive" style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}>
              <Clock size={12} /> {pendingRequests.length} pending review
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>Avg 4hr reply</span>
          </div>
        </div>

        {/* Card 4: Escrow & Active Projects */}
        <div
          className="stat-card"
          onClick={() => navigateTo('brand-projects')}
          style={{ cursor: 'pointer' }}
        >
          <div className="stat-label">
            <span>Active Escrow Projects</span>
            <FolderKanban size={16} color="#059669" />
          </div>
          <div className="stat-value">
            {activeProjects.length}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <span className="stat-trend positive">
              <ShieldCheck size={12} /> $14,200 Secured
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>Milestone backed</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Creators + Activity Feed */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Left: Recommended Creators with Explainable AI Match */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={15} color="var(--primary)" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Explainable AI Recommendations
                </h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '2px 0 0' }}>
                Ranked by model stack, verified node proofs, and brand brief compatibility
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('explore-creators')}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--primary)', fontWeight: 600 }}
            >
              <span>Explore All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommendedCreators.map((creator) => (
              <div
                key={creator.id}
                onClick={() => {
                  setSelectedCreatorId(creator.id);
                  navigateTo('brand-creator-detail');
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
                  e.currentTarget.style.borderColor = '#C7D2FE';
                  e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                        {creator.name}
                      </span>
                      <EvidenceBadge status={creator.evidenceStatus} size="small" />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {creator.specialization} • {creator.tools?.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <MatchScoreBadge score={creator.matchScore || 98} size="small" />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    From ${creator.startingPrice}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Real-time Activity Feed */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={15} color="#059669" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Live Workspace Pipeline
              </h2>
            </div>
            <span className="badge badge-verified" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              <span className="badge-dot" style={{ backgroundColor: '#059669' }}></span> Realtime
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivities.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {act.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {act.subtitle}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '4px' }}>
                    {act.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SaaS Campaign Table Overview */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF'
        }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Active Brand Briefs & Procurement Status
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Track proposal counts, target aspect ratios, and deadline countdowns
            </p>
          </div>
          <button
            onClick={() => navigateTo('my-campaigns')}
            className="btn btn-outline btn-sm"
          >
            Manage All Briefs
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="saas-table">
            <thead>
              <tr>
                <th>Brief / Campaign Title</th>
                <th>Content Category</th>
                <th>Aspect Ratio</th>
                <th>Budget (Escrow)</th>
                <th>Required Tools</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.slice(0, 3).map((camp) => (
                <tr key={camp.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{camp.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{camp.brandName} • Due in 2 weeks</div>
                  </td>
                  <td>
                    <span className="badge badge-purple" style={{ fontSize: '0.7rem' }}>
                      {camp.contentCategory}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                      {camp.aspectRatio || '16:9'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${camp.budget?.toLocaleString()}</div>
                    <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>Escrow Ready</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {camp.requiredTools?.slice(0, 2).join(', ') || 'Runway Gen-3, ComfyUI'}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                      <span className="badge-dot" style={{ backgroundColor: '#059669' }}></span> Active
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedCampaignId(camp.id);
                        navigateTo('explore-creators');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      Find Matches
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboardPage;
