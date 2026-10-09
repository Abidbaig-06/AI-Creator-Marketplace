import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ShieldCheck, Heart, ExternalLink, Award, Globe } from 'lucide-react';

export const Footer = () => {
  const { navigateTo } = useApp();

  return (
    <footer style={{
      backgroundColor: '#09090B',
      color: '#A1A1AA',
      borderTop: '1px solid #27272A',
      paddingTop: '64px',
      paddingBottom: '44px'
    }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '48px',
          marginBottom: '56px'
        }}>
          {/* Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M12 1L14.4 9.6L23 12L14.4 14.4L12 23L9.6 14.4L1 12L9.6 9.6L12 1Z" />
              </svg>
              <span style={{ color: '#FFFFFF', fontWeight: 850, fontSize: '1.2rem', letterSpacing: '-0.03em' }}>
                Creativity Meets Opportunity
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#A1A1AA' }}>
              The network for creative intelligence. Commission-free contracts, cryptographic evidence audits, and verified talent.
            </p>
          </div>

          {/* Column 1: For Clients */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              For Clients
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <li>
                <button onClick={() => navigateTo('directory')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  Explore Creators
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('brand-dashboard')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  Post a Job Brief
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('ai-brief-builder')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  AI Brief Builder
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('how-it-works')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  Payments & Escrow
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: For Creators */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              For Creators
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <li>
                <button onClick={() => navigateTo('creator-dashboard')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  Creator Studio
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('available-campaigns')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  Available Briefs
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('evidence-verification')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  C2PA Evidence Verification
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('how-it-works')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  Commission-Free Payouts
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Challenges */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '0.85rem', marginBottom: '16px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Trending Challenges
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
              <li>
                <button onClick={() => navigateTo('directory')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  InVideo Editor Challenge ($11K)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('directory')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  Rive Interactive Challenge ($10K)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('directory')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  Lovable Business Challenge ($25K)
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('directory')} style={{ background: 'none', border: 'none', color: '#A1A1AA', cursor: 'pointer', textAlign: 'left', transition: 'color 0.15s' }}>
                  Cantina Creative Challenge ($50K)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #27272A',
          paddingTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.8125rem'
        }}>
          <div>
            © {new Date().getFullYear()} Contra Creative Network. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#71717A' }}>Privacy Policy</span>
            <span style={{ color: '#71717A' }}>Terms of Service</span>
            <span style={{ color: '#71717A' }}>Trust & Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
