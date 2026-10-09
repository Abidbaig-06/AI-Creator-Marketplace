import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceBadge, MatchScoreBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  Sparkles,
  Send,
  Bookmark,
  Share2,
  CheckCircle2,
  Lock,
  Layers,
  FileCode2,
  ArrowLeft,
  DollarSign,
  Award,
  Play,
  X
} from 'lucide-react';

export const PublicCreatorDetailPage = () => {
  const {
    selectedCreatorId,
    creators,
    evidenceRecords,
    navigateTo,
    shortlistedCreatorIds,
    toggleShortlist,
    currentRole,
    sendCollaborationRequest,
    switchRole,
    addToast
  } = useApp();

  const creator = creators.find((c) => c.id === selectedCreatorId) || creators[0];
  const isShortlisted = shortlistedCreatorIds.includes(creator.id);
  const [activeTab, setActiveTab] = useState('portfolio');
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);

  const handleHireClick = () => {
    switchRole('brand');
    navigateTo('brand-creator-detail', { creatorId: creator.id });
  };

  return (
    <div style={{ padding: '32px 24px 80px', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigateTo('directory')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Creator Directory</span>
      </button>

      {/* Hero Profile Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '32px', backgroundColor: '#FFFFFF' }}>
        {/* Cover Photo */}
        <div style={{
          height: '200px',
          backgroundImage: `url(${creator.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
            <button
              type="button"
              onClick={() => toggleShortlist(creator.id)}
              className="btn btn-outline btn-sm"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            >
              <Bookmark size={15} fill={isShortlisted ? 'var(--primary)' : 'none'} color={isShortlisted ? 'var(--primary)' : 'currentColor'} />
              <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
            </button>
          </div>
        </div>

        {/* Profile Info Bar */}
        <div style={{ padding: '0 32px 32px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            marginTop: '-45px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', flexWrap: 'wrap' }}>
              <img
                src={creator.avatar}
                alt={creator.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #FFFFFF',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {creator.name}
                  </h1>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{creator.handle}</span>
                  <EvidenceBadge status={creator.evidenceStatus} />
                </div>
                <div style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '4px' }}>
                  {creator.headline}
                </div>
              </div>
            </div>

            {/* Price and CTA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Starting From</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>${creator.startingPrice}</div>
              </div>
              <button
                type="button"
                onClick={handleHireClick}
                className="btn btn-primary"
                style={{ padding: '12px 24px', fontWeight: 700 }}
              >
                <Send size={15} />
                <span>Hire / Send Brief</span>
              </button>
            </div>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            {creator.bio}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {creator.tools.map((t, idx) => (
              <span key={idx} className="badge badge-indigo">
                {t}
              </span>
            ))}
            {creator.skills.map((s, idx) => (
              <span key={idx} className="badge badge-gray">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '18px', color: 'var(--text-primary)' }}>
        AI Portfolio Renders & Case Studies
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {(creator.portfolio || []).map((item) => (
          <div
            key={item.id}
            className="card card-hover"
            onClick={() => setSelectedPortfolioItem(item)}
            style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}
          >
            <div style={{ height: '220px', position: 'relative', backgroundColor: '#0F172A' }}>
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(15, 23, 42, 0.75)', color: '#FFFFFF', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700 }}>
                {item.category}
              </div>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px', flex: 1 }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {item.tools.map((t, idx) => (
                  <span key={idx} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedPortfolioItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPortfolioItem(null)}
          title={selectedPortfolioItem.title}
        >
          <div style={{ padding: '4px 0' }}>
            <div style={{ width: '100%', height: '300px', backgroundColor: '#0F172A', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '18px' }}>
              <img
                src={selectedPortfolioItem.image}
                alt={selectedPortfolioItem.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Description:
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '4px' }}>
                {selectedPortfolioItem.description}
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                Generation Prompt:
              </div>
              <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                "{selectedPortfolioItem.promptSummary}"
              </code>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-verified">
                <ShieldCheck size={14} />
                <span>{selectedPortfolioItem.evidenceType}</span>
              </span>

              <button
                type="button"
                onClick={handleHireClick}
                className="btn btn-primary"
              >
                <span>Hire This Creator</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PublicCreatorDetailPage;
