import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  User,
  Image,
  Briefcase,
  Send,
  Mail,
  FolderKanban,
  MessageSquare,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Zap,
  Globe,
  Award
} from 'lucide-react';

export const CreatorSidebar = () => {
  const {
    currentPage,
    navigateTo,
    switchRole,
    activeCreatorProfile,
    collaborationRequests,
    notifications
  } = useApp();

  const [creatorMenuOpen, setCreatorMenuOpen] = useState(false);

  const pendingInvitations = collaborationRequests.filter(
    (r) => r.creatorId === activeCreatorProfile.id && (r.status === 'Sent' || r.status === 'Counteroffer')
  ).length;
  const unreadNotifs = notifications?.creator?.filter((n) => !n.read).length || 0;

  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        { id: 'creator-dashboard', label: 'Overview', icon: <LayoutDashboard size={17} /> },
        { id: 'creator-projects', label: 'Active Projects', icon: <FolderKanban size={17} /> }
      ]
    },
    {
      title: 'CREATIVE ASSETS',
      items: [
        { id: 'my-creator-profile', label: 'Profile Builder', icon: <User size={17} /> },
        { id: 'portfolio-manager', label: 'Portfolio & Nodes', icon: <Image size={17} />, isAi: true },
        { id: 'evidence-verification', label: 'Evidence & Trust', icon: <ShieldCheck size={17} color="#059669" /> },
        { id: 'public-profile-preview', label: 'Live Storefront', icon: <Globe size={17} /> }
      ]
    },
    {
      title: 'MARKETPLACE DEALS',
      items: [
        { id: 'available-campaigns', label: 'Explore Briefs', icon: <Briefcase size={17} /> },
        {
          id: 'creator-requests',
          label: 'Invitations & Offers',
          icon: <Mail size={17} />,
          badge: pendingInvitations > 0 ? pendingInvitations : null
        }
      ]
    },
    {
      title: 'SETTINGS',
      items: [
        { id: 'creator-notifications', label: 'Notifications', icon: <Bell size={17} />, badge: unreadNotifs > 0 ? unreadNotifs : null },
        { id: 'creator-settings', label: 'Payouts & Security', icon: <Settings size={17} /> }
      ]
    }
  ];

  function Bell(props) {
    return <Mail {...props} />;
  }

  return (
    <aside className="workspace-sidebar">
      {/* Creator Profile Switcher */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--border-light)' }}>
        <div
          onClick={() => setCreatorMenuOpen(!creatorMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            backgroundColor: creatorMenuOpen ? 'var(--bg-secondary)' : 'transparent',
            transition: 'background-color 0.15s ease',
            border: '1px solid',
            borderColor: creatorMenuOpen ? 'var(--border-light)' : 'transparent'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
            <img
              src={activeCreatorProfile.avatar}
              alt={activeCreatorProfile.name}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '1.5px solid var(--primary)'
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
                {activeCreatorProfile.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="badge badge-verified" style={{ padding: '1px 6px', fontSize: '0.62rem', fontWeight: 700 }}>
                  <span className="badge-dot" style={{ backgroundColor: '#059669' }}></span> Verified Creator
                </span>
              </div>
            </div>
          </div>
          <ChevronDown size={14} color="var(--text-muted)" style={{ transform: creatorMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
        </div>

        {/* Dropdown Menu */}
        {creatorMenuOpen && (
          <div style={{
            marginTop: '8px',
            padding: '6px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ padding: '6px 8px', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              CREATOR REPUTATION TIER
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              backgroundColor: 'var(--status-verified-bg)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--status-verified)'
            }}>
              <span>Top 1% Generative Master</span>
              <span>4.95 ★</span>
            </div>
            <div
              onClick={() => { navigateTo('my-creator-profile'); setCreatorMenuOpen(false); }}
              style={{ padding: '6px 8px', fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer', borderRadius: 'var(--radius-sm)', marginTop: '2px' }}
            >
              Edit Public Portfolio & Rates
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
                (item.id === 'available-campaigns' && (currentPage === 'creator-campaign-detail' || currentPage === 'submit-proposal'));

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

      {/* Profile Health / Verification Level */}
      <div style={{
        margin: '0 12px 10px',
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, #F8FAFC 0%, #ECFDF5 100%)',
        border: '1px solid #A7F3D0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            <Award size={13} color="#059669" />
            <span>Profile Readiness</span>
          </div>
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669' }}>95%</span>
        </div>
        <div style={{ width: '100%', height: '5px', backgroundColor: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: '95%', height: '100%', backgroundColor: '#059669', borderRadius: '999px' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.68rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>ComfyUI Node Graph Verified</span>
          <span
            onClick={() => navigateTo('evidence-verification')}
            style={{ color: '#059669', fontWeight: 600, cursor: 'pointer' }}
          >
            Manage
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
          onClick={() => switchRole('brand')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%',
            padding: '7px 10px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid #C7D2FE',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={13} />
          <span>Switch to Brand Workspace</span>
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

export default CreatorSidebar;
