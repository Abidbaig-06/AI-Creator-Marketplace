import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Sparkles,
  User,
  Briefcase,
  FolderKanban,
  Settings,
  ArrowRight,
  ShieldCheck,
  Scale,
  Send,
  X,
  Command
} from 'lucide-react';

export const CommandPalette = ({ isOpen, onClose }) => {
  const {
    currentRole,
    navigateTo,
    creators,
    campaigns,
    switchRole,
    setSelectedCreatorId,
    setSelectedCampaignId
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open
          if (typeof onClose === 'function') {
            // handle externally
          }
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter actions and items
  const brandActions = [
    { id: 'action-ai-brief', title: 'Generate AI Brief', category: 'Actions', icon: <Sparkles size={16} color="#6366F1" />, action: () => { navigateTo('ai-brief-builder'); onClose(); } },
    { id: 'action-discover', title: 'Discover Creators', category: 'Navigation', icon: <Search size={16} />, action: () => { navigateTo('explore-creators'); onClose(); } },
    { id: 'action-projects', title: 'Active Projects & Escrow', category: 'Navigation', icon: <FolderKanban size={16} />, action: () => { navigateTo('brand-projects'); onClose(); } },
    { id: 'action-shortlist', title: 'Compare Shortlisted Creators', category: 'Navigation', icon: <Scale size={16} />, action: () => { navigateTo('shortlist-compare'); onClose(); } },
    { id: 'action-switch-creator', title: 'Switch to AI Creator Mode', category: 'Workspace', icon: <User size={16} color="#8B5CF6" />, action: () => { switchRole('creator'); onClose(); } }
  ];

  const creatorActions = [
    { id: 'action-portfolio', title: 'Portfolio & Node Graph Manager', category: 'Actions', icon: <Sparkles size={16} color="#8B5CF6" />, action: () => { navigateTo('portfolio-manager'); onClose(); } },
    { id: 'action-briefs', title: 'Explore Open Brand Briefs', category: 'Navigation', icon: <Briefcase size={16} />, action: () => { navigateTo('available-campaigns'); onClose(); } },
    { id: 'action-verify', title: 'Evidence & Verification Portal', category: 'Trust', icon: <ShieldCheck size={16} color="#059669" />, action: () => { navigateTo('evidence-verification'); onClose(); } },
    { id: 'action-active', title: 'Active Client Milestones', category: 'Navigation', icon: <FolderKanban size={16} />, action: () => { navigateTo('creator-projects'); onClose(); } },
    { id: 'action-switch-brand', title: 'Switch to Brand Workspace', category: 'Workspace', icon: <Briefcase size={16} color="#6366F1" />, action: () => { switchRole('brand'); onClose(); } }
  ];

  const currentActions = currentRole === 'brand' ? brandActions : creatorActions;

  // Search creators
  const matchedCreators = creators
    .filter((c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.specialization.toLowerCase().includes(query.toLowerCase()) ||
      c.tools?.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    )
    .slice(0, 3)
    .map((c) => ({
      id: `creator-${c.id}`,
      title: `${c.name} — ${c.specialization}`,
      subtitle: `${c.tools?.slice(0, 3).join(', ')} • ${c.rating}★`,
      category: 'Creators',
      icon: <img src={c.avatar} alt={c.name} style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }} />,
      action: () => {
        setSelectedCreatorId(c.id);
        navigateTo(currentRole === 'brand' ? 'brand-creator-detail' : 'creator-detail');
        onClose();
      }
    }));

  const filteredItems = [
    ...currentActions.filter((a) => a.title.toLowerCase().includes(query.toLowerCase())),
    ...matchedCreators
  ];

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          padding: 0,
          border: '1px solid var(--border-light)',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)'
        }}
      >
        {/* Search Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 18px',
          borderBottom: '1px solid var(--border-light)',
          backgroundColor: '#FFFFFF'
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Type a command, creator, or brief..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              background: 'transparent'
            }}
          />
          <kbd className="search-shortcut-kbd">ESC</kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No matching commands or creators found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: selectedIndex === idx ? 'var(--bg-secondary)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase' }}>
                    {item.category}
                  </span>
                  <ArrowRight size={13} color="var(--text-light)" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--border-light)',
          backgroundColor: '#F8FAFC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span><kbd className="search-shortcut-kbd">↑</kbd> <kbd className="search-shortcut-kbd">↓</kbd> to navigate</span>
            <span><kbd className="search-shortcut-kbd">↵</kbd> to select</span>
          </div>
          <span style={{ fontWeight: 600, color: 'var(--primary)' }}>CreatorProof SaaS Spotlight</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
