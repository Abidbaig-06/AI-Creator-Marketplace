import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Briefcase,
  PlusCircle,
  Search,
  Copy,
  Pause,
  Play,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  Calendar,
  DollarSign,
  Users,
  Edit3,
  Eye,
  Trash2,
  Building2,
  Layers,
  ShieldCheck,
  Film,
  Monitor
} from 'lucide-react';

export const MyCampaignsPage = () => {
  const {
    campaigns,
    navigateTo,
    duplicateCampaign,
    toggleCampaignStatus,
    setSelectedCampaignId
  } = useApp();

  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesTab = activeTab === 'All' || c.status === activeTab;
      const matchesSearch =
        !searchTerm.trim() ||
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contentCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.creativeStyle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [campaigns, activeTab, searchTerm]);

  const counts = {
    All: campaigns.length,
    Active: campaigns.filter((c) => c.status === 'Active').length,
    Draft: campaigns.filter((c) => c.status === 'Draft').length,
    Paused: campaigns.filter((c) => c.status === 'Paused').length,
    Completed: campaigns.filter((c) => c.status === 'Completed').length
  };

  const handleCreateNew = () => {
    setSelectedCampaignId(null);
    navigateTo('create-campaign');
  };

  const handleEditCampaign = (campId) => {
    setSelectedCampaignId(campId);
    navigateTo('create-campaign');
  };

  const handleFindMatches = (campId) => {
    setSelectedCampaignId(campId);
    navigateTo('explore-creators');
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Briefcase size={15} />
            <span>Creative Brief Management</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            My Creative Briefs & Campaigns
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Manage active procurement briefs, edit requirements, and match verified AI creators against campaign specs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigateTo('ai-brief-builder')}
            className="btn btn-outline"
            style={{ borderColor: '#C7D2FE', color: 'var(--primary)' }}
          >
            <Sparkles size={15} color="var(--primary)" />
            <span>AI Brief Builder</span>
          </button>
          <button
            type="button"
            onClick={handleCreateNew}
            className="btn btn-primary"
          >
            <PlusCircle size={16} />
            <span>+ Create Brief</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '28px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', 'Active', 'Draft', 'Paused', 'Completed'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  backgroundColor: activeTab === tab ? 'var(--primary-light)' : 'transparent',
                  color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: activeTab === tab ? '#C7D2FE' : 'var(--border-light)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab} ({counts[tab]})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.85rem' }}
              placeholder="Search briefs by title, category, or style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Campaigns Listing Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFFFFF' }}>
          <Briefcase size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
            No briefs found in this view
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Get started by creating a new creative brief or using the AI Brief Builder.
          </p>
          <button
            type="button"
            onClick={handleCreateNew}
            className="btn btn-primary"
          >
            Create Your First Brief
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="card card-hover"
              style={{ padding: '24px', backgroundColor: '#FFFFFF' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
                      {camp.contentCategory || 'AI Video & Visuals'}
                    </span>
                    {camp.creativeStyle && (
                      <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>
                        Style: {camp.creativeStyle}
                      </span>
                    )}
                    {camp.aspectRatio && (
                      <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>
                        {camp.aspectRatio}
                      </span>
                    )}
                    {camp.format && (
                      <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>
                        {camp.format}
                      </span>
                    )}
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Created {camp.createdAt}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {camp.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor:
                      camp.status === 'Active' ? '#ECFDF5' :
                      camp.status === 'Draft' ? 'var(--bg-secondary)' :
                      camp.status === 'Paused' ? '#FFFBEB' : '#EFF6FF',
                    color:
                      camp.status === 'Active' ? '#059669' :
                      camp.status === 'Draft' ? 'var(--text-secondary)' :
                      camp.status === 'Paused' ? '#D97706' : '#2563EB',
                    border: '1px solid currentColor'
                  }}>
                    {camp.status}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                {camp.objective || camp.description}
              </p>

              {/* Tools & Deliverables Specs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '18px', backgroundColor: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Required AI Tools & Models:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {camp.requiredTools && camp.requiredTools.length > 0 ? (
                      camp.requiredTools.map((t, idx) => (
                        <span key={idx} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                          {t}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Flux.1 Pro, ComfyUI</span>
                    )}
                  </div>
                </div>

                <div style={{ marginLeft: 'auto' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Commercial Scope & Protection:
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <ShieldCheck size={14} color="#059669" />
                    <span>{camp.usageRights || 'Full Commercial Global Buyout'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
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
                    <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>${camp.budget?.toLocaleString()}</strong>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Deadline: <strong>{camp.deadline || 'In 2-3 weeks'}</strong>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Applicants: <strong>{camp.applicantsCount || 0}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    onClick={() => duplicateCampaign(camp.id)}
                    className="btn btn-ghost btn-sm"
                    title="Duplicate Brief"
                    style={{ padding: '6px 10px' }}
                  >
                    <Copy size={15} />
                    <span>Duplicate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditCampaign(camp.id)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 12px' }}
                  >
                    <Edit3 size={14} />
                    <span>Edit Brief</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFindMatches(camp.id)}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '6px 14px' }}
                  >
                    <Sparkles size={14} />
                    <span>Find Matching Creators</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCampaignsPage;

