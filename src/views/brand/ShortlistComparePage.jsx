import React from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceBadge, MatchScoreBadge } from '../../components/common/Badge';
import {
  Scale,
  Trash2,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Star,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ShortlistComparePage = () => {
  const {
    shortlistedCreatorIds,
    creators,
    toggleShortlist,
    navigateTo,
    setSelectedCreatorId
  } = useApp();

  const shortlistedCreators = creators.filter((c) =>
    shortlistedCreatorIds.includes(c.id)
  );

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Scale size={15} />
            <span>Procurement Evaluation Matrix</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Shortlist & Side-by-Side Comparison
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Compare technical capabilities, pricing rates, and verified workflow evidence across your saved AI creators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('explore-creators')}
          className="btn btn-outline"
        >
          <PlusCircle size={15} />
          <span>Add More Creators</span>
        </button>
      </div>

      {shortlistedCreators.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '70px 20px', backgroundColor: '#FFFFFF' }}>
          <Scale size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
            Your shortlist is currently empty
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 24px', fontSize: '0.925rem' }}>
            Shortlist creators from the Discover Creators marketplace to compare their verified proofs and pricing side by side.
          </p>
          <button
            type="button"
            onClick={() => navigateTo('explore-creators')}
            className="btn btn-primary"
          >
            <span>Explore Creators Directory</span>
            <ArrowRight size={16} />
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `220px repeat(${shortlistedCreators.length}, minmax(280px, 1fr))`,
            gap: '16px',
            minWidth: `${220 + shortlistedCreators.length * 300}px`
          }}>
            {/* Column 0: Metric Headers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Evaluation Criteria
                </span>
              </div>
              <div className="card" style={{ padding: '16px', fontWeight: 700, fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}>
                AI Match Score
              </div>
              <div className="card" style={{ padding: '16px', fontWeight: 700, fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}>
                Verification Status
              </div>
              <div className="card" style={{ padding: '16px', fontWeight: 700, fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}>
                Starting Project Price
              </div>
              <div className="card" style={{ padding: '16px', fontWeight: 700, fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}>
                Hourly Rate
              </div>
              <div className="card" style={{ padding: '16px', fontWeight: 700, fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}>
                Mastered AI Tools
              </div>
              <div className="card" style={{ padding: '16px', fontWeight: 700, fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}>
                Commercial Rights
              </div>
              <div className="card" style={{ padding: '16px', fontWeight: 700, fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}>
                Availability
              </div>
            </div>

            {/* Columns 1..N: Shortlisted Creators */}
            {shortlistedCreators.map((creator) => (
              <div key={creator.id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Header Card */}
                <div className="card" style={{ height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => toggleShortlist(creator.id)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#EF4444', padding: '4px' }}
                        title="Remove from Shortlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      {creator.name}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {creator.specialization}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCreatorId(creator.id);
                        navigateTo('brand-creator-detail');
                      }}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, fontSize: '0.78rem' }}
                    >
                      <Eye size={13} />
                      <span>Profile</span>
                    </button>
                  </div>
                </div>

                {/* Score */}
                <div className="card" style={{ padding: '16px', backgroundColor: '#FFFFFF' }}>
                  <MatchScoreBadge score={creator.matchScore || 96} />
                </div>

                {/* Verification */}
                <div className="card" style={{ padding: '16px', backgroundColor: '#FFFFFF' }}>
                  <EvidenceBadge status={creator.evidenceStatus} />
                </div>

                {/* Starting Price */}
                <div className="card" style={{ padding: '16px', fontWeight: 800, color: 'var(--primary)', backgroundColor: '#FFFFFF' }}>
                  ${creator.startingPrice}
                </div>

                {/* Hourly Rate */}
                <div className="card" style={{ padding: '16px', fontWeight: 600, backgroundColor: '#FFFFFF' }}>
                  ${creator.hourlyRate}/hr
                </div>

                {/* Tools */}
                <div className="card" style={{ padding: '16px', backgroundColor: '#FFFFFF' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {creator.tools.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="badge badge-gray" style={{ fontSize: '0.68rem' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rights */}
                <div className="card" style={{ padding: '16px', fontSize: '0.825rem', color: 'var(--text-secondary)', backgroundColor: '#FFFFFF' }}>
                  {creator.usageTerms?.commercialRights || 'Full Buyout'}
                </div>

                {/* Availability */}
                <div className="card" style={{ padding: '16px', fontSize: '0.825rem', fontWeight: 600, color: '#059669', backgroundColor: '#FFFFFF' }}>
                  {creator.availability}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortlistComparePage;
