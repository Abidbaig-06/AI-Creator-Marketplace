import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  FileSpreadsheet,
  Sparkles,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

export const BrandNotificationsPage = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    navigateTo
  } = useApp();

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Unread'

  const brandNotifs = notifications.brand || [];
  const filteredNotifs = brandNotifs.filter((n) => {
    if (activeFilter === 'Unread') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle2 size={18} color="#059669" />;
      case 'proposal':
        return <FileSpreadsheet size={18} color="#0284C7" />;
      case 'counteroffer':
        return <AlertCircle size={18} color="#D97706" />;
      default:
        return <Sparkles size={18} color="var(--electric-teal)" />;
    }
  };

  const handleNotificationClick = (notif) => {
    markNotificationRead('brand', notif.id);
    if (notif.actionPage) {
      navigateTo(notif.actionPage, {
        projectId: notif.targetId?.startsWith('proj-') ? notif.targetId : undefined,
        campaignId: notif.targetId?.startsWith('camp-') ? notif.targetId : undefined
      });
    }
  };

  return (
    <div className="page-content animate-fade-in" style={{ maxWidth: '880px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted-gray)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Bell size={16} color="var(--electric-teal)" />
            <span>Activity & Alerts</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
            Notifications
          </h1>
          <p style={{ color: 'var(--muted-gray)', fontSize: '0.9rem', marginTop: '4px' }}>
            Stay updated on new creator proposals, milestone asset uploads, counteroffers, and project statuses.
          </p>
        </div>

        <button
          onClick={() => markAllNotificationsRead('brand')}
          className="btn btn-outline btn-sm"
        >
          <CheckCheck size={14} />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
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
          All Notifications ({brandNotifs.length})
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
          Unread ({brandNotifs.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <CheckCircle2 size={40} color="#059669" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
            You're all caught up!
          </h3>
          <p style={{ color: 'var(--muted-gray)', fontSize: '0.85rem', marginTop: '4px' }}>
            No new unread alerts or pending actions at this moment.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
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
                    <h4 style={{ fontSize: '0.98rem', fontWeight: notif.read ? 600 : 800, margin: 0, color: 'var(--ink-black)' }}>
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
