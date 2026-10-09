import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceBadge, MatchScoreBadge } from '../../components/common/Badge';
import {
  Search,
  Filter,
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  Check,
  Star,
  Layers,
  ArrowUpDown,
  Compass,
  DollarSign,
  ShieldCheck,
  Zap,
  Tag,
  Eye,
  RotateCcw
} from 'lucide-react';

export const CreatorDirectoryPage = () => {
  const {
    creators,
    navigateTo,
    shortlistedCreatorIds,
    toggleShortlist,
    currentRole,
    setSelectedCreatorId
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTool, setSelectedTool] = useState('All');
  const [selectedEvidence, setSelectedEvidence] = useState('All');
  const [maxBudget, setMaxBudget] = useState(5000);
  const [sortBy, setSortBy] = useState('rating');

  const categories = ['All', 'Product Visuals', 'AI Film', 'AI Fashion', '3D Animation', 'Social Video & UGC', 'Engineering & Automation', 'Character Design'];
  const popularTools = ['All', 'Flux.1 Pro', 'ComfyUI', 'Midjourney v6.1', 'Runway Gen-3', 'ElevenLabs', 'Spline 3D', 'Kling AI'];

  // Filter & Search Logic
  const filteredCreators = useMemo(() => {
    return creators
      .filter((creator) => {
        const matchesSearch =
          !searchTerm.trim() ||
          creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          creator.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
          creator.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          creator.tools.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
          creator.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory =
          selectedCategory === 'All' || creator.category.toLowerCase().includes(selectedCategory.toLowerCase());

        const matchesTool =
          selectedTool === 'All' || creator.tools.includes(selectedTool);

        const matchesEvidence =
          selectedEvidence === 'All' || creator.evidenceStatus === selectedEvidence;

        const matchesBudget = creator.startingPrice <= maxBudget;

        return matchesSearch && matchesCategory && matchesTool && matchesEvidence && matchesBudget;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price-asc') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price-desc') return b.startingPrice - a.startingPrice;
        return 0;
      });
  }, [creators, searchTerm, selectedCategory, selectedTool, selectedEvidence, maxBudget, sortBy]);

  return (
    <div style={{ padding: '40px 24px 80px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Directory Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
          <Compass size={15} />
          <span>Marketplace Directory</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Explore AI Creators & Filmmakers
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '700px', marginTop: '4px' }}>
          Browse specialized AI filmmakers, 3D animators, and generative artists with cryptographic workflow proof and commercial rights.
        </p>
      </div>

      {/* Semantic Search & Filter Bar */}
      <div className="card" style={{ padding: '24px', marginBottom: '32px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {/* Main Search Input */}
          <div style={{ position: 'relative' }}>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Search Keywords:
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '36px' }}
                placeholder="Search Sophia, ComfyUI, Runway..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Specialization Category:
            </label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tool Dropdown */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              AI Tool / Model:
            </label>
            <select
              className="form-select"
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
            >
              {popularTools.map((tool) => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </div>

          {/* Evidence Filter */}
          <div>
            <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Trust Verification:
            </label>
            <select
              className="form-select"
              value={selectedEvidence}
              onChange={(e) => setSelectedEvidence(e.target.value)}
            >
              <option value="All">All Verification Levels</option>
              <option value="verified">Verified Claims Only</option>
              <option value="evidence-linked">Verification Pending</option>
              <option value="self-reported">Self-Reported</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.925rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredCreators.length}</strong> AI creators
        </div>
      </div>

      {/* Creators Grid */}
      {filteredCreators.length === 0 ? (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: '#FFFFFF' }}>
          <Search size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
            No creators found matching your search
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Try resetting your filters to explore all creators.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="card card-hover"
              onClick={() => {
                setSelectedCreatorId(creator.id);
                navigateTo('creator-detail', { creatorId: creator.id });
              }}
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}
            >
              {/* Thumbnail */}
              <div style={{ height: '170px', position: 'relative', backgroundColor: '#0F172A' }}>
                <img
                  src={creator.portfolio[0]?.image || creator.coverImage}
                  alt={creator.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'rgba(15, 23, 42, 0.75)', color: '#FFFFFF', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700 }}>
                  {creator.category}
                </div>
              </div>

              {/* Creator Info */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        {creator.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {creator.specialization}
                      </div>
                    </div>
                  </div>
                  <EvidenceBadge status={creator.evidenceStatus} size="small" />
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px', flex: 1 }}>
                  {creator.bio}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {creator.tools.slice(0, 3).map((t, idx) => (
                    <span key={idx} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-light)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Starting: </span>
                    <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>${creator.startingPrice}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700 }}>
                    <Star size={13} fill="#F59E0B" color="#F59E0B" />
                    <span>{creator.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatorDirectoryPage;
