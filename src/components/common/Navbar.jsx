import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Building2, User, Search, LogIn, UserPlus } from 'lucide-react';

export const Navbar = () => {
  const { currentPage, navigateTo, switchRole } = useApp();

  return (
    <header style={{
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-light)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      transition: 'all 0.2s ease'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '0 28px',
        height: '74px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <div
          onClick={() => navigateTo('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#09090B'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L14.4 9.6L23 12L14.4 14.4L12 23L9.6 14.4L1 12L9.6 9.6L12 1Z" />
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontWeight: 850,
              fontSize: '1.2rem',
              letterSpacing: '-0.03em',
              color: '#09090B',
              lineHeight: 1
            }}>
              Creativity Meets Opportunity
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: '#18181B',
              padding: '1px 6px',
              borderRadius: '9999px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              AI
            </span>
          </div>
        </div>

        {/* Center Navigation Links: Explore */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigateTo('directory')}
            style={{
              background: 'transparent',
              border: 'none',
              color: currentPage === 'directory' ? '#09090B' : '#52525B',
              fontWeight: currentPage === 'directory' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              marginLeft: '8px',
              transition: 'color 0.15s ease'
            }}
          >
            Explore Creators
          </button>
        </nav>

        {/* Action CTAs (Sign up, Log in) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigateTo('auth', { defaultTab: 'signin' })}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#09090B',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '8px 14px',
              cursor: 'pointer'
            }}
          >
            Log in
          </button>

          <button
            onClick={() => navigateTo('auth', { defaultTab: 'signup' })}
            className="btn btn-dark"
            style={{
              padding: '8px 20px',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: '#09090B',
              color: '#FFFFFF'
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
