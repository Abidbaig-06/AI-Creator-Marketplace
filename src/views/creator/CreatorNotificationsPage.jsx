import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  DollarSign,
  Inbox,
  Sparkles,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const CreatorNotificationsPage = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    navigateTo
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Unread'

  const creatorNotifs = notifications.creator || [];
  const filteredNotifs = creatorNotifs.filter((n) => {
    if (activeFilter === 'Unread') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'payout':
        return <DollarSign size={18} color="#059669" />;
      case 'invitation':
        return <Inbox size={18} color="#0284C7" />;
      case 'verification':
        return <ShieldCheck size={18} color="#7C3AED" />;
      default:
        return <Sparkles size={18} color="var(--electric-teal)" />;
    }
  };

  const handleClick = (notif) => {
    markNotificationRead('creator', notif.id);
    if (notif.actionPage) {
      navigateTo(notif.actionPage);
    }
  };

  return (
    <div className="page-content animate-fade-in" style={{ maxWidth: '880px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted-gray)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Bell size={16} color="var(--electric-teal)" />
            <span>Creator Activity Feed</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
            Creator Notifications
          </h1>
          <p style={{ color: 'var(--muted-gray)', fontSize: '0.9rem', marginTop: '4px' }}>
            Track invitations, milestone approvals, escrow payment credits, and evidence audit updates.
          </p>
        </div>

        <button
          onClick={() => markAllNotificationsRead('creator')}
          className="btn btn-outline btn-sm"
        >
          <CheckCheck size={14} />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveFilter('All')}
          style={{
            background: activeFilter === 'All' ? 'var(--ink-black)' : 'var(--warm-ivory-light)',
            color: activeFilter === 'All' ? 'var(--white)' : 'var(--ink-black)',
            border: '1px solid var(--soft-border)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          All Notifications ({creatorNotifs.length})
        </button>
        <button
          onClick={() => setActiveFilter('Unread')}
          style={{
            background: activeFilter === 'Unread' ? 'var(--ink-black)' : 'var(--warm-ivory-light)',
            color: activeFilter === 'Unread' ? 'var(--white)' : 'var(--ink-black)',
            border: '1px solid var(--soft-border)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Unread ({creatorNotifs.filter((n) => !n.read).length})
        </button>
      </div>

      {/* List */}
      {filteredNotifs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <CheckCircle2 size={40} color="#059669" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
            All caught up!
          </h3>
          <p style={{ color: 'var(--muted-gray)', fontSize: '0.85rem', marginTop: '4px' }}>
            No pending creator notifications.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleClick(notif)}
              className="card card-hover"
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: notif.read ? 'var(--white)' : '#FAFDFD',
                borderLeft: notif.read ? '1px solid var(--soft-border)' : '4px solid var(--electric-teal)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--warm-ivory-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {getIcon(notif.type)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: notif.read ? 600 : 800, margin: 0 }}>
                      {notif.title}
                    </h4>
                    {!notif.read && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--electric-teal)' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--muted-gray)', margin: '2px 0 0' }}>
                    {notif.description}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-gray)' }}>
                  {notif.timestamp}
                </span>
                <ArrowRight size={16} color="var(--muted-gray)" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
