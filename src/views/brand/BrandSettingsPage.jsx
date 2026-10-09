import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Shield,
  Bell,
  Lock,
  CreditCard,
  User,
  Save,
  CheckCircle2
} from 'lucide-react';

export const BrandSettingsPage = () => {
  const { brandProfile, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('account');

  const [settings, setSettings] = useState({
    billingEmail: 'billing@acmehealth.tech',
    escrowAutoRelease: false,
    emailNotifications: true,
    weeklyReport: true,
    twoFactorAuth: true
  });

  const handleSave = (e) => {
    e.preventDefault();
    addToast({
      title: 'Settings Saved',
      message: 'Your account and billing preferences have been updated.',
      type: 'success'
    });
  };

  return (
    <div className="page-content animate-fade-in" style={{ maxWidth: '880px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
          Brand Settings & Security
        </h1>
        <p style={{ color: 'var(--muted-gray)', fontSize: '0.9rem', marginTop: '4px' }}>
          Manage your enterprise billing, milestone escrow rules, team permissions, and account credentials.
        </p>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button
          className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          Company & Contact
        </button>
        <button
          className={`tab-btn ${activeTab === 'billing' ? 'active' : ''}`}
          onClick={() => setActiveTab('billing')}
        >
          Billing & Escrow
        </button>
        <button
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security & 2FA
        </button>
        <button
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          Notification Preferences
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Tab 1: Account */}
        {activeTab === 'account' && (
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
              Company Contact Information
            </h3>
            <div className="form-group">
              <label className="form-label">Primary Admin Email</label>
              <input
                type="email"
                className="form-input"
                defaultValue="marketing@acmehealth.tech"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Billing Notifications Email</label>
              <input
                type="email"
                className="form-input"
                value={settings.billingEmail}
                onChange={(e) => setSettings({ ...settings, billingEmail: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Primary Business Location</label>
              <input
                type="text"
                className="form-input"
                defaultValue="San Francisco, CA, United States"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Billing & Escrow */}
        {activeTab === 'billing' && (
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
              Escrow & Payment Methods
            </h3>
            <div style={{ background: 'var(--warm-ivory-light)', padding: '16px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                Active Payment Method: Corporate Visa ending in 8842
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--muted-gray)' }}>
                Protected by CreatorProof Escrow Vault with automated milestone locking.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
              <input
                type="checkbox"
                id="autoRelease"
                checked={settings.escrowAutoRelease}
                onChange={(e) => setSettings({ ...settings, escrowAutoRelease: e.target.checked })}
              />
              <label htmlFor="autoRelease" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                Enable auto-release of milestone payments 7 days after deliverable submission if no revision requested
              </label>
            </div>
          </div>
        )}

        {/* Tab 3: Security */}
        {activeTab === 'security' && (
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
              Password & Two-Factor Authentication
            </h3>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" placeholder="••••••••••••" />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" placeholder="Minimum 8 characters" />
            </div>
            <div style={{ background: '#ECFDF5', padding: '14px', borderRadius: 'var(--radius-md)', marginTop: '16px', color: '#065F46', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              <span>Two-Factor Authentication (Authenticator App) is active.</span>
            </div>
          </div>
        )}

        {/* Tab 4: Notifications */}
        {activeTab === 'notifications' && (
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>
              Email & Webhook Notification Settings
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                />
                <span>Instant email alerts when a creator submits a milestone deliverable</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.weeklyReport}
                  onChange={(e) => setSettings({ ...settings, weeklyReport: e.target.checked })}
                />
                <span>Weekly AI creative procurement summary report</span>
              </label>
            </div>
          </div>
        )}

        {/* Action Bar */}
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
