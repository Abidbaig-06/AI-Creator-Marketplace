import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceBadge } from '../../components/common/Badge';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Globe,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Users,
  User,
  Play,
  X,
  Building2,
  Palette,
  Briefcase,
  Star,
  CheckCircle2,
  DollarSign,
  Award,
  Zap
} from 'lucide-react';

export const LandingPage = () => {
  const { navigateTo, switchRole, creators } = useApp();
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('All');
  const carouselRef = useRef(null);

  const categories = ['All', 'Product Visuals', 'AI Film', 'AI Fashion', '3D Animation', 'Character Design'];

  const trendingChallenges = [
    {
      id: 'challenge-1',
      tag: '# The invideo Editor Challenge',
      title: 'Submit your video for a chance to win $10k in prizes',
      prize: '$11K',
      deadline: '3d Left',
      themeColor: '#4F46E5',
      bgGradient: 'linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(17, 18, 21, 0.95) 100%)',
      image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
      ]
    },
    {
      id: 'challenge-2',
      tag: '# Rive Halloween Challenge',
      title: 'Submit your Halloween creation & interactive assets',
      prize: '$10K',
      deadline: '3d Left',
      themeColor: '#EA580C',
      bgGradient: 'linear-gradient(135deg, rgba(234, 88, 12, 0.25) 0%, rgba(17, 18, 21, 0.95) 100%)',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      avatars: [
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
      ]
    },
    {
      id: 'challenge-3',
      tag: '# Lovable Challenge',
      title: "Lovable's built it for small business generative challenge",
      prize: '$25K',
      deadline: '7d ago',
      themeColor: '#9333EA',
      bgGradient: 'linear-gradient(135deg, rgba(147, 51, 234, 0.25) 0%, rgba(17, 18, 21, 0.95) 100%)',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      avatars: [
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
      ]
    },
    {
      id: 'challenge-4',
      tag: '# Cantina Challenge',
      title: 'Submit your creation to win $50k in total prizes',
      prize: '$50K',
      deadline: '13d ago',
      themeColor: '#059669',
      bgGradient: 'linear-gradient(135deg, rgba(5, 150, 105, 0.25) 0%, rgba(17, 18, 21, 0.95) 100%)',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
      ]
    },
    {
      id: 'challenge-5',
      tag: '# Flux.1 Photorealism Award',
      title: 'Generate hyperrealistic luxury product advertising visuals',
      prize: '$15K',
      deadline: '4d Left',
      themeColor: '#2563EB',
      bgGradient: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(17, 18, 21, 0.95) 100%)',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
      ]
    }
  ];

  const showcaseCards = [
    {
      id: 'creator-1',
      tag: 'Product Visuals',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      title: 'Sophia Chan',
      subtitle: 'AI Filmmaker & Visual Artist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      projectTitle: 'Velora Eau De Parfum Botanical Campaign',
      tools: ['Flux.1 Pro', 'ComfyUI', 'Runway Gen-3'],
      evidence: 'C2PA Manifest Verified • 8K Octane Render',
      price: '$1,800',
      rating: 4.98
    },
    {
      id: 'creator-2',
      tag: 'AI Film',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      title: 'Daniel Kim',
      subtitle: 'Cinematic AI Trailer & VFX Director',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      projectTitle: 'Citadel in the Clouds: Fantasy Film Trailer',
      tools: ['OpenAI Sora', 'Runway Gen-3', 'Midjourney v6.1'],
      evidence: 'C2PA Manifest Signed • Multi-Angle Consistency',
      price: '$2,000',
      rating: 4.96
    },
    {
      id: 'creator-3',
      tag: 'AI Fashion',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      title: 'Lily Park',
      subtitle: 'Digital Couture & Virtual Lookbooks',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      projectTitle: 'Obsidian Horizon Techwear Lookbook',
      tools: ['Flux.1 Pro', 'ComfyUI', 'Magnific AI'],
      evidence: 'Audited Model Weights Hash • Custom LoRA',
      price: '$1,600',
      rating: 4.94
    },
    {
      id: 'creator-4',
      tag: '3D Animation',
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
      title: 'Ravi Patel',
      subtitle: '3D Animator & Neural Storyteller',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      projectTitle: 'Nova & Bot: The Floating Sky Islands',
      tools: ['Blender 4.2', 'Runway Gen-3', 'ComfyUI 3D'],
      evidence: 'Audited Blender+AI Hash • Neural Keyframes',
      price: '$1,400',
      rating: 4.92
    }
  ];

  const filteredCards = activeCategoryFilter === 'All'
    ? showcaseCards
    : showcaseCards.filter(c => c.tag === activeCategoryFilter);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh', color: '#09090B' }}>
      
      {/* 1. CONTRA HERO SECTION */}
      <section className="contra-grid-bg" style={{
        padding: '76px 24px 64px',
        borderBottom: '1px solid #E4E4E7',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Main Contra Headline */}
          <h1 style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.4rem)',
            fontWeight: 850,
            lineHeight: 1.08,
            marginBottom: '16px',
            color: '#09090B',
            letterSpacing: '-0.038em'
          }}>
            Creativity Meets Opportunity
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            color: '#71717A',
            maxWidth: '680px',
            margin: '0 auto 40px',
            fontWeight: 450,
            lineHeight: 1.5,
            letterSpacing: '-0.015em'
          }}>
            The network for creative intelligence.
          </p>

          {/* DUAL PERSONA GATEWAY: BRAND HUB & CREATOR HUB */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
            maxWidth: '860px',
            margin: '0 auto 8px'
          }}>
            {/* Brand Hub Gateway Card */}
            <div
              onClick={() => switchRole('brand')}
              className="card card-hover"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #E4E4E7',
                borderRadius: '24px',
                padding: '28px 26px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #E4E4E7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Building2 size={26} color="#09090B" />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: '#71717A', letterSpacing: '0.04em' }}>
                    FOR CLIENTS & BRANDS
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#09090B', margin: '2px 0 0' }}>
                    Brand Hub
                  </h3>
                  <div style={{ fontSize: '0.86rem', color: '#71717A', marginTop: '2px' }}>
                    Post briefs & hire verified AI creators
                  </div>
                </div>
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#F4F4F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ArrowRight size={16} color="#09090B" />
              </div>
            </div>

            {/* Creator Hub Gateway Card */}
            <div
              onClick={() => switchRole('creator')}
              className="card card-hover"
              style={{
                backgroundColor: '#09090B',
                border: '1px solid #27272A',
                borderRadius: '24px',
                padding: '28px 26px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                color: '#FFFFFF',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#18181B',
                  border: '1px solid #27272A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={26} color="#A78BFA" />
                </div>
                <div>
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: '#A1A1AA', letterSpacing: '0.04em' }}>
                    FOR AI ARTISTS & DIRECTORS
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 850, color: '#FFFFFF', margin: '2px 0 0' }}>
                    Creator Hub
                  </h3>
                  <div style={{ fontSize: '0.86rem', color: '#A1A1AA', marginTop: '2px' }}>
                    Showcase portfolio & keep 100% earnings
                  </div>
                </div>
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#18181B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ArrowRight size={16} color="#FFFFFF" />
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* 2. TRENDING TOPICS & CHALLENGES CAROUSEL (DIRECT FROM SCREENSHOT) */}
      <section style={{
        padding: '52px 28px 60px',
        maxWidth: '1380px',
        margin: '0 auto'
      }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#71717A'
          }}>
            <span>TRENDING TOPICS</span>
            <TrendingUp size={15} color="#18181B" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigateTo('directory')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#09090B',
                fontWeight: 650,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>View community</span>
              <ArrowRight size={14} />
            </button>

            {/* Carousel Navigation Buttons */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => scrollCarousel('left')}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #E4E4E7',
                  backgroundColor: '#FFFFFF',
                  color: '#09090B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #E4E4E7',
                  backgroundColor: '#FFFFFF',
                  color: '#09090B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable Challenge Cards Slider */}
        <div
          ref={carouselRef}
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '12px',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {trendingChallenges.map((item) => (
            <div
              key={item.id}
              onClick={() => navigateTo('directory')}
              className="challenge-card"
              style={{
                flex: '0 0 320px',
                scrollSnapAlign: 'start',
                cursor: 'pointer',
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Dark Gradient Overlay for Ultra Readability */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(9, 9, 11, 0.6) 0%, rgba(9, 9, 11, 0.94) 100%)',
                zIndex: 1
              }}></div>

              {/* Card Content */}
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                
                {/* Header Tag */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontSize: '0.84rem',
                      fontWeight: 750,
                      color: '#FFFFFF',
                      letterSpacing: '-0.01em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{item.tag}</span>
                    </span>
                    <ArrowRight size={14} color="#A1A1AA" />
                  </div>

                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    lineHeight: 1.35,
                    color: '#F4F4F5',
                    marginBottom: '18px'
                  }}>
                    {item.title}
                  </h3>
                </div>

                {/* Footer Info: Prize & Overlapping Avatars */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '14px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.12)'
                }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF' }}>
                      {item.prize}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#A1A1AA', fontWeight: 500 }}>
                      Prize • {item.deadline}
                    </div>
                  </div>

                  {/* Overlapping Avatar Rings */}
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {item.avatars.map((av, avIdx) => (
                      <img
                        key={avIdx}
                        src={av}
                        alt="Creator"
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          border: '2px solid #111215',
                          marginLeft: avIdx === 0 ? '0' : '-8px',
                          objectFit: 'cover'
                        }}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>





      {/* 4. CURATED SHOWCASE & DIRECTORY PREVIEW */}
      <section style={{
        padding: '40px 28px 80px',
        maxWidth: '1380px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '32px',
          gap: '20px'
        }}>
          <div>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#71717A',
              marginBottom: '6px'
            }}>
              PORTFOLIO SHOWCASE
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 850, color: '#09090B', letterSpacing: '-0.03em' }}>
              Explore top AI creators & work
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`prompt-pill ${activeCategoryFilter === cat ? 'active' : ''}`}
                style={{ fontSize: '0.82rem', padding: '6px 16px' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Creator Showcase Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {filteredCards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigateTo('creator-detail', { creatorId: card.id })}
              className="card card-hover"
              style={{
                padding: '0',
                overflow: 'hidden',
                borderRadius: '20px',
                cursor: 'pointer',
                border: '1px solid #E4E4E7'
              }}
            >
              {/* Image Preview Container */}
              <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
                <img
                  src={card.image}
                  alt={card.projectTitle}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                />
                
                {/* Tag pill */}
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: '#09090B'
                }}>
                  {card.tag}
                </div>

                {/* Evidence Verified Tag */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(9, 9, 11, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 650,
                  color: '#34D399',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <ShieldCheck size={13} color="#34D399" />
                  <span>Verified Manifest</span>
                </div>
              </div>

              {/* Creator Metadata Details */}
              <div style={{ padding: '20px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <img
                    src={card.avatar}
                    alt={card.title}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 750, fontSize: '0.95rem', color: '#09090B' }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#71717A' }}>
                      {card.subtitle}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#09090B',
                  marginBottom: '14px',
                  lineHeight: 1.4
                }}>
                  {card.projectTitle}
                </div>

                {/* Tool Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {card.tools.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        backgroundColor: '#F4F4F5',
                        borderRadius: '6px',
                        color: '#52525B',
                        fontWeight: 600
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Card Footer: Price & View Profile */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #F4F4F5'
                }}>
                  <span style={{ fontSize: '0.84rem', color: '#71717A', fontWeight: 500 }}>
                    Starts at <strong style={{ color: '#09090B', fontWeight: 750 }}>{card.price}</strong>
                  </span>

                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: '#09090B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    View Profile
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Creators CTA Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => navigateTo('directory')}
            className="btn btn-outline btn-lg"
            style={{ padding: '12px 32px' }}
          >
            <span>Explore All 2,400+ Verified AI Creators</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>


      {/* 5. CONTRA PLATFORM ADVANTAGES */}
      <section style={{
        padding: '64px 28px 84px',
        backgroundColor: '#FAFAFA',
        borderTop: '1px solid #E4E4E7'
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 850, color: '#09090B', marginBottom: '14px', letterSpacing: '-0.03em' }}>
            Built for modern creative intelligence
          </h2>
          <p style={{ fontSize: '1.05rem', color: '#71717A', maxWidth: '640px', margin: '0 auto 48px' }}>
            Everything you need to hire, collaborate, and get paid with cryptographic trust.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            textAlign: 'left'
          }}>
            <div className="card" style={{ padding: '28px 24px', backgroundColor: '#FFFFFF' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <DollarSign size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#09090B' }}>
                Commission-Free Escrow
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#52525B', lineHeight: 1.6 }}>
                Creators take home 100% of their earnings. Brands fund secure milestone escrow released upon deliverable sign-off.
              </p>
            </div>

            <div className="card" style={{ padding: '28px 24px', backgroundColor: '#FFFFFF' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#EEF2FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#09090B' }}>
                Cryptographic Evidence Audit
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#52525B', lineHeight: 1.6 }}>
                C2PA manifest verification, model weights hashing, and ComfyUI node workflows audited for complete provenance.
              </p>
            </div>

            <div className="card" style={{ padding: '28px 24px', backgroundColor: '#FFFFFF' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#F5F3FF',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <Sparkles size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#09090B' }}>
                Autonomous Brief Matching
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#52525B', lineHeight: 1.6 }}>
                Semantic AI matchmaker explains exactly why each creator fits your prompt, technical requirements, and aesthetic style.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
