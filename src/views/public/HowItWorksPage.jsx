import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Send,
  CheckCircle,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Lock,
  Search,
  Scale
} from 'lucide-react';

export const HowItWorksPage = () => {
  const { navigateTo, switchRole } = useApp();
  const [activeWorkflow, setActiveWorkflow] = useState('brand'); // 'brand' | 'creator'

  const brandSteps = [
    {
      step: '01',
      title: 'Build or AI-Generate Your Campaign Brief',
      description: 'Define your objectives, required deliverables (4K video, 3D worlds, virtual lookbooks), aspect ratios (16:9, 9:16), and timeline. Use our AI Brief Builder to instantly structure rough prompts into production-ready briefs.',
      icon: <Sparkles size={24} color="var(--primary)" />
    },
    {
      step: '02',
      title: 'Algorithmic Matching & Evidence Audit',
      description: 'Our proprietary matching engine evaluates creators based on verified tool mastery (Flux.1, ComfyUI, Runway Gen-3, ElevenLabs) and past client work. Review itemized match breakdowns, strengths, and risk gaps.',
      icon: <ShieldCheck size={24} color="var(--primary)" />
    },
    {
      step: '03',
      title: 'Shortlist, Compare & Send Requests',
      description: 'Compare creator portfolios side-by-side on verified claims, pricing tiers, turnaround SLAs, and declared usage rights. Send direct collaboration invitations or receive proposals to open briefs.',
      icon: <Scale size={24} color="var(--primary)" />
    },
    {
      step: '04',
      title: 'Milestone Escrow & Seamless Collaboration',
      description: 'Funds are securely deposited into CreatorProof Escrow. Collaborate with structured milestone reviews, inspect multi-version file previews, request revisions, and release payouts upon approving milestones.',
      icon: <Lock size={24} color="var(--primary)" />
    }
  ];

  const creatorSteps = [
    {
      step: '01',
      title: 'Create Your Verified Creator Portfolio',
      description: 'Set up your specialized AI artist profile, declare your core tools (Flux.1, Midjourney, ComfyUI, ElevenLabs, Sora), showcase your case studies, and declare your standard commercial licensing terms.',
      icon: <Layers size={24} color="#7C3AED" />
    },
    {
      step: '02',
      title: 'Submit Workflow Proof & Provenance',
      description: 'Upgrade your portfolio claims by linking raw generation node graphs, platform export logs, and verified client sign-offs to earn the Verified Creator badge.',
      icon: <ShieldCheck size={24} color="#7C3AED" />
    },
    {
      step: '03',
      title: 'Discover Campaigns & Submit Custom Pitches',
      description: 'Browse brand campaigns matched to your exact skillset with explainable suitability scores. Submit custom proposals, milestone breakdowns, or counteroffers on budget and timelines.',
      icon: <FileSpreadsheet size={24} color="#7C3AED" />
    },
    {
      step: '04',
      title: 'Deliver Work & Guaranteed Payouts',
      description: 'Once the brand funds escrow, upload your work versions and prompt archives. Payouts are guaranteed and instantly credited to your balance upon milestone sign-off.',
      icon: <CheckCircle size={24} color="#7C3AED" />
    }
  ];

  return (
    <div style={{ padding: '60px 24px 100px', maxWidth: '1180px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--primary-light)',
          border: '1px solid #C7D2FE',
          padding: '4px 14px',
          borderRadius: 'var(--radius-full)',
          color: 'var(--primary)',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '16px',
          textTransform: 'uppercase'
        }}>
          MARKETPLACE WORKFLOW GUIDE
        </div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '16px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          How CreatorProof AI Works
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          A frictionless, audited procurement workflow designed specifically for the unique requirements of generative AI creative production.
        </p>
      </div>

      {/* Role Toggle Switch */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '6px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-flex',
          gap: '6px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <button
            type="button"
            onClick={() => setActiveWorkflow('brand')}
            style={{
              padding: '10px 28px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: activeWorkflow === 'brand' ? 'var(--primary)' : 'transparent',
              color: activeWorkflow === 'brand' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.925rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <Building2 size={16} />
            <span>For Brands & Agencies</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveWorkflow('creator')}
            style={{
              padding: '10px 28px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              backgroundColor: activeWorkflow === 'creator' ? '#7C3AED' : 'transparent',
              color: activeWorkflow === 'creator' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.925rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={16} />
            <span>For AI Creators</span>
          </button>
        </div>
      </div>

      {/* Workflow Steps Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '64px' }}>
        {(activeWorkflow === 'brand' ? brandSteps : creatorSteps).map((stepItem, idx) => (
          <div key={idx} className="card" style={{ padding: '32px 24px', backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: activeWorkflow === 'brand' ? 'var(--primary-light)' : 'var(--secondary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {stepItem.icon}
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-light)' }}>
                {stepItem.step}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '10px', color: 'var(--text-primary)' }}>
              {stepItem.title}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {stepItem.description}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom CTA Box */}
      <div className="card" style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        padding: '48px 36px',
        textAlign: 'center',
        border: '1.5px solid var(--border-light)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px', color: 'var(--text-primary)' }}>
          Ready to experience the future of AI creative collaboration?
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '560px', margin: '0 auto 28px' }}>
          Explore vetted talent or launch your next generative commercial with escrow protection.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => switchRole('brand')}
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            <span>Start as Brand</span>
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => switchRole('creator')}
            className="btn btn-secondary"
            style={{ padding: '12px 28px', fontSize: '0.95rem', backgroundColor: '#7C3AED', borderColor: '#7C3AED', color: '#FFFFFF' }}
          >
            <span>Start as AI Creator</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
