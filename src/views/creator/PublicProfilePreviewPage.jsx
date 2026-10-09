import React from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceBadge } from '../../components/common/Badge';
import {
  ArrowLeft,
  Eye,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Send,
  Lock,
  Building2
} from 'lucide-react';

export const PublicProfilePreviewPage = () => {
  const { activeCreatorProfile, evidenceRecords, navigateTo } = useApp();

  const creatorEvidence = evidenceRecords.filter(
    (e) => e.creatorId === activeCreatorProfile.id
  );

  return (
    <div className="page-content animate-fade-in" style={{ maxWidth: '1180px' }}>
      {/* Live Preview Notification Banner */}
      <div style={{
        backgroundColor: '#FFFFFF',
        color: 'var(--text-primary)',
        padding: '14px 20px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1.5px solid #C7D2FE',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
          <Eye size={18} color="var(--primary)" />
          <span><strong>Public Profile Live Preview:</strong> This is how brand clients and creative directors see your portfolio and trust signals.</span>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('creator-profile')}
          className="btn btn-outline btn-sm"
        >
          <ArrowLeft size={14} />
          <span>Back to Profile Editor</span>
        </button>
      </div>

      {/* Hero Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '28px', backgroundColor: '#FFFFFF' }}>
        <div style={{ height: '200px', backgroundImage: `url(${activeCreatorProfile.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />

        <div style={{ padding: '0 32px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginTop: '-45px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
              <img
                src={activeCreatorProfile.avatar}
                alt={activeCreatorProfile.name}
                style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #FFFFFF', boxShadow: 'var(--shadow-md)' }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {activeCreatorProfile.name}
                  </h1>
                  <EvidenceBadge status={activeCreatorProfile.evidenceStatus || 'verified'} />
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '2px' }}>
                  {activeCreatorProfile.headline}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary btn-sm">
                <Send size={14} />
                <span>Request Collaboration</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--border-light)', fontSize: '0.88rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 700 }}>
              ★ {activeCreatorProfile.rating} ({activeCreatorProfile.reviewsCount} reviews)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
              <MapPin size={15} /> {activeCreatorProfile.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 600 }}>
              <Clock size={15} /> {activeCreatorProfile.availability}
            </span>
            <div style={{ marginLeft: 'auto', fontWeight: 800, color: 'var(--primary)' }}>
              ${activeCreatorProfile.hourlyRate}/hr • Starts at ${activeCreatorProfile.startingPrice}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)' }}>
          Showcase Portfolio ({activeCreatorProfile.portfolio?.length || 0})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          {(activeCreatorProfile.portfolio || []).map((item) => (
            <div key={item.id} className="card" style={{ padding: 0, overflow: 'hidden', backgroundColor: '#FFFFFF' }}>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '18px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {item.category}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '4px 0 8px', color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{item.description}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {item.tools.map((t, i) => (
                    <span key={i} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePreviewPage;
