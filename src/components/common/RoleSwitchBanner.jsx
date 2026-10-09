import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Users, Briefcase } from 'lucide-react';

export const RoleSwitchBanner = () => {
  const { currentRole, switchRole, currentPage, navigateTo, campaigns, creators } = useApp();

  const allPages = [
    { section: 'Public Marketplace', pages: [
      { id: 'landing', label: 'Landing Page' },
      { id: 'directory', label: 'Creator Directory' },
      { id: 'creator-detail', label: 'Public Creator Portfolio Detail' },
      { id: 'how-it-works', label: 'How It Works' },
      { id: 'auth', label: 'Authentication & Role Selection' }
    ]},
    { section: 'Brand / Agency Workspace', pages: [
      { id: 'brand-dashboard', label: 'Brand Dashboard' },
      { id: 'brand-profile', label: 'Brand Profile' },
      { id: 'my-campaigns', label: 'My Campaigns' },
      { id: 'create-campaign', label: 'Create Campaign / Edit Brief' },
      { id: 'ai-brief-builder', label: 'AI Brief Builder' },
      { id: 'explore-creators', label: 'Explore Creators' },
      { id: 'brand-creator-detail', label: 'Creator Profile Detail (Brand View)' },
      { id: 'shortlist-compare', label: 'Shortlist & Compare' },
      { id: 'brand-requests', label: 'Collaboration Requests' },
      { id: 'brand-projects', label: 'Projects & Deliverables' },
      { id: 'brand-notifications', label: 'Notifications' },
      { id: 'brand-settings', label: 'Brand Settings' }
    ]},
    { section: 'AI Creator Workspace', pages: [
      { id: 'creator-dashboard', label: 'Creator Dashboard' },
      { id: 'creator-profile', label: 'My Creator Profile' },
      { id: 'portfolio-manager', label: 'Portfolio Manager' },
      { id: 'evidence-verification', label: 'Evidence & Verification' },
      { id: 'available-campaigns', label: 'Available Campaigns' },
      { id: 'creator-campaign-detail', label: 'Campaign Detail (Creator View)' },
      { id: 'submit-proposal', label: 'Submit Proposal' },
      { id: 'creator-requests', label: 'Collaboration Requests' },
      { id: 'creator-projects', label: 'Active Engagements & Projects' },
      { id: 'creator-notifications', label: 'Creator Notifications' },
      { id: 'creator-settings', label: 'Creator Settings' },
      { id: 'public-profile-preview', label: 'Public Profile Preview' }
    ]}
  ];

  return (
    <div className="role-switch-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, letterSpacing: '0.02em' }}>
          <span style={{ color: 'var(--electric-teal)', display: 'inline-flex' }}>⚡</span>
          <span>CREATORPROOF AI</span>
          <span style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.15)', padding: '2px 6px', borderRadius: '4px', color: '#CCC' }}>
            PROTOTYPE SUITE
          </span>
        </div>

        <div className="role-pill-group">
          <button
            className={`role-pill ${currentRole === 'public' ? 'active' : ''}`}
            onClick={() => switchRole('public')}
          >
            Public Marketplace
          </button>
          <button
            className={`role-pill ${currentRole === 'brand' ? 'active' : ''}`}
            onClick={() => switchRole('brand')}
          >
            Brand Workspace
          </button>
          <button
            className={`role-pill ${currentRole === 'creator' ? 'active' : ''}`}
            onClick={() => switchRole('creator')}
          >
            AI Creator Workspace
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: '#888', fontSize: '0.78rem' }}>Jump to Screen:</span>
        <select
          value={currentPage}
          onChange={(e) => navigateTo(e.target.value)}
          style={{
            background: '#222',
            color: '#EEE',
            border: '1px solid #444',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            maxWidth: '280px'
          }}
        >
          {allPages.map((group, idx) => (
            <optgroup label={group.section} key={idx}>
              {group.pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
    </div>
  );
};
