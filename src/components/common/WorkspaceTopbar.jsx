import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Sparkles,
  Search,
  Building2,
  User,
  ShieldCheck,
  ChevronRight,
  Shield,
  CreditCard,
  CheckCircle2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { CommandPalette } from './CommandPalette';

export const WorkspaceTopbar = ({ title, subtitle, actionButton, breadcrumbs = [] }) => {
  const {
    currentRole,
    currentPage,
    navigateTo,
    notifications,
    brandProfile,
    activeCreatorProfile,
    switchRole,
    markNotificationAsRead
  } = useApp();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const roleNotifs = currentRole === 'brand' ? (notifications?.brand || []) : (notifications?.creator || []);
  const unreadCount = roleNotifs.filter((n) => !n.read).length;

  return (
    <>
      <header className="workspace-topbar">
        {/* Left: Breadcrumbs & Dynamic Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div className="breadcrumbs">
            <span
              className="crumb-link"
              onClick={() => navigateTo(currentRole === 'brand' ? 'brand-dashboard' : 'creator-dashboard')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {currentRole === 'brand' ? <Building2 size={13} /> : <User size={13} />}
              {currentRole === 'brand' ? 'Brand Workspace' : 'Creator Studio'}
            </span>
            <ChevronRight size={12} color="var(--text-light)" />
            <span className="crumb-current">{title}</span>
          </div>
        </div>

        {/* Center: Global Search & Command Bar (Ctrl+K) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="search-trigger-btn"
            title="Search creators, briefs, or actions"
          >
            <Search size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8125rem' }}>Search creators, briefs, tools...</span>
            <kbd className="search-shortcut-kbd">Ctrl+K</kbd>
          </button>
        </div>

        {/* Right: Actions, Escrow Badge, Notifications, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Contextual Action Button */}
          {actionButton}

          {/* Quick AI Brief Action for Brands */}
          {currentRole === 'brand' && currentPage !== 'ai-brief-builder' && (
            <button
              onClick={() => navigateTo('ai-brief-builder')}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Sparkles size={13} />
              <span>AI Brief Builder</span>
            </button>
          )}

          {/* Escrow Shield Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#059669',
              cursor: 'help'
            }}
            title="Milestone Escrow Protection: Contract funds are locked in project escrow and released only upon explicit brand approval of verified deliverables."
          >
            <ShieldCheck size={13} color="#059669" />
            <span>Escrow Guaranteed</span>
          </div>

          {/* Notifications Trigger & Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              style={{
                position: 'relative',
                background: notifDropdownOpen ? 'var(--primary-light)' : 'var(--bg-secondary)',
                border: '1px solid',
                borderColor: notifDropdownOpen ? 'var(--primary)' : 'var(--border-light)',
                borderRadius: 'var(--radius-md)',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: notifDropdownOpen ? 'var(--primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: 'var(--primary)',
                  color: '#FFFFFF',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notifDropdownOpen && (
              <div
                className="animate-fade-in"
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '42px',
                  width: '320px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  zIndex: 100,
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#F8FAFC'
                }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Activity Notifications
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigateTo(currentRole === 'brand' ? 'brand-notifications' : 'creator-notifications')}>
                    View All
                  </span>
                </div>

                <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                  {roleNotifs.length === 0 ? (
                    <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      No new notifications
                    </div>
                  ) : (
                    roleNotifs.slice(0, 4).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(currentRole, n.id)}
                        style={{
                          padding: '10px 14px',
                          borderBottom: '1px solid var(--border-subtle)',
                          backgroundColor: n.read ? '#FFFFFF' : 'var(--primary-light)',
                          cursor: 'pointer',
                          transition: 'background-color 0.1s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>{n.title}</span>
                          {!n.read && <span className="badge-dot" style={{ backgroundColor: 'var(--primary)' }}></span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: '4px' }}>{n.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account Avatar Pill */}
          <div
            onClick={() =>
              navigateTo(currentRole === 'brand' ? 'brand-profile' : 'my-creator-profile')
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '3px 10px 3px 4px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
              transition: 'border-color 0.15s ease'
            }}
          >
            <img
              src={currentRole === 'brand' ? brandProfile.logo : activeCreatorProfile.avatar}
              alt="User"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentRole === 'brand' ? brandProfile.name.split(' ')[0] : activeCreatorProfile.name.split(' ')[0]}
            </span>
          </div>
        </div>
      </header>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </>
  );
};

export default WorkspaceTopbar;
