import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Search,
  Sparkles,
  Briefcase,
  Scale,
  Send,
  FolderKanban,
  MessageSquare,
  Settings,
  LogOut,
  Building2,
  Bell,
  ChevronDown,
  Zap,
  ShieldCheck,
  CreditCard,
  Layers
} from 'lucide-react';

export const BrandSidebar = () => {
  const {
    currentPage,
    navigateTo,
    switchRole,
    brandProfile,
    collaborationRequests,
    notifications,
    shortlistedCreatorIds
  } = useApp();

  const [orgMenuOpen, setOrgMenuOpen] = useState(false);

  const pendingRequests = collaborationRequests.filter(
    (r) => r.status === 'Sent' || r.status === 'Counteroffer'
  ).length;
  const unreadNotifs = notifications?.brand?.filter((n) => !n.read).length || 0;

  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        { id: 'brand-dashboard', label: 'Overview', icon: <LayoutDashboard size={17} /> },
        { id: 'brand-projects', label: 'Active Projects', icon: <FolderKanban size={17} /> }
      ]
    },
    {
      title: 'CREATIVE STUDIO',
      items: [
        { id: 'explore-creators', label: 'Discover Creators', icon: <Search size={17} /> },
        { id: 'ai-brief-builder', label: 'AI Brief Builder', icon: <Sparkles size={17} />, isAi: true },
        { id: 'my-campaigns', label: 'My Briefs', icon: <Briefcase size={17} /> },
        {
          id: 'shortlist-compare',
          label: 'Shortlisted',
          icon: <Scale size={17} />,
          badge: shortlistedCreatorIds.length > 0 ? shortlistedCreatorIds.length : null
        }
      ]
    },
    {
      title: 'COLLABORATION',
      items: [
        {
          id: 'brand-requests',
          label: 'Applications',
          icon: <Send size={17} />,
          badge: pendingRequests > 0 ? pendingRequests : null
        }
      ]
    },
    {
      title: 'PREFERENCES',
      items: [
        { id: 'brand-notifications', label: 'Notifications', icon: <Bell size={17} />, badge: unreadNotifs > 0 ? unreadNotifs : null },
        { id: 'brand-profile', label: 'Company Profile', icon: <Building2 size={17} /> },
        { id: 'brand-settings', label: 'Settings & Escrow', icon: <Settings size={17} /> }
      ]
    }
  ];

  return (
    <aside className="workspace-sidebar">
      {/* Workspace Org Switcher */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--border-light)' }}>
        <div
          onClick={() => setOrgMenuOpen(!orgMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            backgroundColor: orgMenuOpen ? 'var(--bg-secondary)' : 'transparent',
            transition: 'background-color 0.15s ease',
            border: '1px solid',
            borderColor: orgMenuOpen ? 'var(--border-light)' : 'transparent'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <img
              src={brandProfile.logo}
              alt={brandProfile.name}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '1px solid var(--border-light)'
              }}
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                color: 'var(--text-primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden'
              }}>
                {brandProfile.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="badge badge-indigo" style={{ padding: '1px 6px', fontSize: '0.62rem', fontWeight: 700 }}>
                  ⚡ Pro Tier
                </span>
              </div>
            </div>
          </div>
          <ChevronDown size={14} color="var(--text-muted)" style={{ transform: orgMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
        </div>

        {/* Dropdown Menu */}
        {orgMenuOpen && (
          <div style={{
            marginTop: '8px',
            padding: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ padding: '6px 8px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              ORGANIZATION WORKSPACE
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              backgroundColor: 'var(--primary-light)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--primary)'
            }}>
              <span>Aura Luxe Enterprise</span>
              <span className="badge-dot" style={{ backgroundColor: '#10B981' }}></span>
            </div>
            <div
              onClick={() => { navigateTo('brand-settings'); setOrgMenuOpen(false); }}
              style={{ padding: '6px 8px', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 'var(--radius-sm)', marginTop: '2px' }}
            >
              Workspace Settings & Billing
            </div>
          </div>
        )}
      </div>

      {/* Nav List */}
      <div style={{ flex: 1, padding: '10px 0', overflowY: 'auto' }}>
        {navSections.map((sec, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '10px' }}>
            <div className="nav-section-title">{sec.title}</div>
            {sec.items.map((item) => {
              const isActive =
                currentPage === item.id ||
                (item.id === 'my-campaigns' && currentPage === 'create-campaign') ||
                (item.id === 'explore-creators' && currentPage === 'brand-creator-detail');

              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="nav-item-icon" style={{ color: isActive ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {item.isAi && !item.badge && (
                      <span style={{
                        fontSize: '0.62rem',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: 'var(--secondary-light)',
                        color: '#7C3AED',
                        fontWeight: 700
                      }}>
                        AI
                      </span>
                    )}
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* AI Credits / Compute Gauge */}
      <div style={{
        margin: '0 12px 10px',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 100%)',
        border: '1px solid #E0E7FF'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <Zap size={13} color="#6366F1" />
            <span>AI Compute Units</span>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)' }}>850 / 1k</span>
        </div>
        <div style={{ width: '100%', height: '5px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #6366F1, #8B5CF6)', borderRadius: '999px' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.68rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>85% consumed</span>
          <span
            onClick={() => navigateTo('brand-settings')}
            style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            Upgrade
          </span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--border-light)',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {/* Switch Role Button */}
        <button
          onClick={() => switchRole('creator')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%',
            padding: '7px 10px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #DDD6FE',
            background: 'var(--secondary-light)',
            color: '#6D28D9',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={13} />
          <span>Switch to AI Creator</span>
        </button>

        <button
          onClick={() => switchRole('public')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            padding: '6px 10px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <LogOut size={14} />
          <span>Exit to Marketplace</span>
        </button>
      </div>
    </aside>
  );
};

export default BrandSidebar;
