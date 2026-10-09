import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Briefcase,
  CheckCircle2,
  Save,
  ExternalLink,
  Sparkles,
  Camera
} from 'lucide-react';

export const BrandProfilePage = () => {
  const { brandProfile, updateBrandProfile, campaigns } = useApp();
  const [formData, setFormData] = useState({ ...brandProfile });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBrandProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>
            Brand & Company Profile
          </h1>
          <p style={{ color: 'var(--muted-gray)', fontSize: '0.9rem', marginTop: '4px' }}>
            Manage your company identity, AI creative guidelines, target demographic, and procurement history.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setFormData({ ...brandProfile });
                  setIsEditing(false);
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Edit Brand Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={formData.logo}
              alt={formData.name}
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: '3px solid var(--electric-teal)'
              }}
            />
            {isEditing && (
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                background: 'var(--ink-black)',
                color: 'var(--white)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <Camera size={14} />
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '280px' }}>
            {isEditing ? (
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label className="form-label">Brand Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            ) : (
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                {formData.name}
              </h2>
            )}

            {isEditing ? (
              <div className="form-group" style={{ marginTop: '10px' }}>
                <label className="form-label">Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>
            ) : (
              <p style={{ color: 'var(--muted-gray)', fontSize: '0.95rem', marginTop: '4px' }}>
                {formData.tagline}
              </p>
            )}

            {/* Badges & Meta */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '12px', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted-gray)' }}>
                <Building2 size={16} /> {formData.industry}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted-gray)' }}>
                <MapPin size={16} /> {formData.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--muted-gray)' }}>
                <Users size={16} /> {formData.companySize}
              </span>
              <a
                href={formData.website}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--electric-teal)', fontWeight: 600 }}
              >
                <Globe size={16} /> {formData.website.replace('https://', '')}
              </a>
            </div>
          </div>
        </div>

        {/* Form Fields & Profile Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
              About the Company
            </h3>
            {isEditing ? (
              <textarea
                className="form-textarea"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            ) : (
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-black)', lineHeight: 1.6 }}>
                {formData.description}
              </p>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
              Strategic AI Creative Goals
            </h3>
            {isEditing ? (
              <textarea
                className="form-textarea"
                rows={4}
                value={formData.goals}
                onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              />
            ) : (
              <p style={{ fontSize: '0.92rem', color: 'var(--ink-black)', lineHeight: 1.6 }}>
                {formData.goals}
              </p>
            )}
          </div>
        </div>

        {/* Preferred Creative Styles & Tooling */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--soft-border)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
            Preferred AI Aesthetic Styles & Toolchain Standards
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {formData.preferredStyles.map((style, idx) => (
              <span
                key={idx}
                style={{
                  background: 'var(--warm-ivory-light)',
                  border: '1px solid var(--soft-border)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                {style}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Past Campaigns History Summary */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
          Campaign Portfolio & Escrow Track Record
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--warm-ivory-light)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted-gray)', textTransform: 'uppercase' }}>Total Campaigns</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{formData.pastCampaignsCount}</div>
          </div>
          <div style={{ background: 'var(--warm-ivory-light)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted-gray)', textTransform: 'uppercase' }}>Total Escrow Disbursed</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>{formData.totalEscrowDisbursed}</div>
          </div>
          <div style={{ background: 'var(--warm-ivory-light)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--muted-gray)', textTransform: 'uppercase' }}>Creator Satisfaction</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>4.96 / 5.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};
