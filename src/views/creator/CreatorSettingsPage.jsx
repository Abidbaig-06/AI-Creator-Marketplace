import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Shield,
  CreditCard,
  Bell,
  Save,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export const CreatorSettingsPage = () => {
  const { activeCreatorProfile, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('payouts');

  const [settings, setSettings] = useState({
    payoutMethod: 'Stripe Direct Connect',
    payoutEmail: 'payouts@elenarostova.ai',
    instantPayouts: true,
    emailAlerts: true,
    publicDiscovery: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    addToast({
      title: 'Creator Settings Saved',
      message: 'Your payout account and profile preferences have been updated.',
      type: 'success'
    });
  };

  return (
    <div className="page-content animate-fade-in" style={{ maxWidth: '880px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
          Creator Settings & Payout Preferences
        </h1>
        <p style={{ color: 'var(--muted-gray)', fontSize: '0.9rem', marginTop: '4px' }}>
          Configure guaranteed escrow payout routing, 2FA credentials, and marketplace visibility.
        </p>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button
          className={`tab-btn ${activeTab === 'payouts' ? 'active' : ''}`}
          onClick={() => setActiveTab('payouts')}
        >
          Payout Routing & Escrow
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security & Credentials
        </button>
        <button
          className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          Marketplace Visibility
        </button>
      </div>

      <form onSubmit={handleSave}>
        {activeTab === 'payouts' && (
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px' }}>
              Connected Payout Methods
            </h3>
            <div style={{ background: '#ECFDF5', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', color: '#065F46' }}>
              <div style={{ fontWeight: 700 }}>✓ Stripe Connect Verified (EUR IBAN ending in 4120)</div>
              <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>
                Escrow funds are deposited automatically within 24 hours of milestone sign-off.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Payout Notification Email</label>
              <input
                type="email"
                className="form-input"
                value={settings.payoutEmail}
                onChange={(e) => setSettings({ ...settings, payoutEmail: e.target.value })}
              />
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px' }}>
              Account Security & Access
            </h3>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" placeholder="••••••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" placeholder="Minimum 8 characters" />
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '18px' }}>
              Discovery & Inbound Invitation Rules
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.publicDiscovery}
                  onChange={(e) => setSettings({ ...settings, publicDiscovery: e.target.checked })}
                />
                <span>Allow enterprise brands to discover my profile in Semantic AI searches</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                />
                <span>Receive instant email notifications for new campaign invitations</span>
              </label>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '24px' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
