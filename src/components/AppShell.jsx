'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { BrandSidebar } from '@/components/common/BrandSidebar';
import { CreatorSidebar } from '@/components/common/CreatorSidebar';
import { WorkspaceTopbar } from '@/components/common/WorkspaceTopbar';
import { ToastContainer } from '@/components/common/ToastContainer';

// Public Pages
import { LandingPage } from '@/views/public/LandingPage';
import { CreatorDirectoryPage } from '@/views/public/CreatorDirectoryPage';
import { PublicCreatorDetailPage } from '@/views/public/PublicCreatorDetailPage';
import { HowItWorksPage } from '@/views/public/HowItWorksPage';
import { AuthPage } from '@/views/public/AuthPage';

// Brand Workspace Pages
import { BrandDashboardPage } from '@/views/brand/BrandDashboardPage';
import { BrandProfilePage } from '@/views/brand/BrandProfilePage';
import { MyCampaignsPage } from '@/views/brand/MyCampaignsPage';
import { CreateCampaignPage } from '@/views/brand/CreateCampaignPage';
import { AIBriefBuilderPage } from '@/views/brand/AIBriefBuilderPage';
import { ExploreCreatorsPage } from '@/views/brand/ExploreCreatorsPage';
import { BrandCreatorDetailPage } from '@/views/brand/BrandCreatorDetailPage';
import { ShortlistComparePage } from '@/views/brand/ShortlistComparePage';
import { BrandRequestsPage } from '@/views/brand/BrandRequestsPage';
import { BrandProjectsPage } from '@/views/brand/BrandProjectsPage';
import { BrandNotificationsPage } from '@/views/brand/BrandNotificationsPage';
import { BrandSettingsPage } from '@/views/brand/BrandSettingsPage';

// Creator Workspace Pages
import { CreatorDashboardPage } from '@/views/creator/CreatorDashboardPage';
import { MyCreatorProfilePage } from '@/views/creator/MyCreatorProfilePage';
import { PortfolioManagerPage } from '@/views/creator/PortfolioManagerPage';
import { EvidenceVerificationPage } from '@/views/creator/EvidenceVerificationPage';
import { AvailableCampaignsPage } from '@/views/creator/AvailableCampaignsPage';
import { CreatorCampaignDetailPage } from '@/views/creator/CreatorCampaignDetailPage';
import { SubmitProposalPage } from '@/views/creator/SubmitProposalPage';
import { CreatorRequestsPage } from '@/views/creator/CreatorRequestsPage';
import { CreatorProjectsPage } from '@/views/creator/CreatorProjectsPage';
import { CreatorNotificationsPage } from '@/views/creator/CreatorNotificationsPage';
import { CreatorSettingsPage } from '@/views/creator/CreatorSettingsPage';
import { PublicProfilePreviewPage } from '@/views/creator/PublicProfilePreviewPage';

const MainContent = () => {
  const { currentRole, currentPage } = useApp();

  // 1. PUBLIC MARKETPLACE VIEW
  if (currentRole === 'public') {
    return (
      <div className="app-container">
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 74px - 300px)' }}>
          {currentPage === 'landing' && <LandingPage />}
          {currentPage === 'directory' && <CreatorDirectoryPage />}
          {currentPage === 'creator-detail' && <PublicCreatorDetailPage />}
          {currentPage === 'how-it-works' && <HowItWorksPage />}
          {currentPage === 'auth' && <AuthPage />}
        </main>
        <Footer />
      </div>
    );
  }

  // 2. BRAND / AGENCY WORKSPACE VIEW
  if (currentRole === 'brand') {
    const getBrandHeader = () => {
      switch (currentPage) {
        case 'brand-dashboard':
          return { title: 'Brand Dashboard', subtitle: 'Overview of active campaigns, proposals, and escrow projects' };
        case 'brand-profile':
          return { title: 'Brand Profile', subtitle: 'Company identity, target audience, and AI aesthetic preferences' };
        case 'my-campaigns':
          return { title: 'My Campaigns', subtitle: 'Manage active procurement briefs, applicants, and statuses' };
        case 'create-campaign':
          return { title: 'Create Campaign / Edit Brief', subtitle: 'Define deliverables, technical tools, timeline, and escrow budget' };
        case 'ai-brief-builder':
          return { title: 'AI Brief Builder', subtitle: 'Autonomous prompt structuring and requirement optimization' };
        case 'explore-creators':
          return { title: 'Explore Creators', subtitle: 'Semantic talent search with explainable AI match scores' };
        case 'brand-creator-detail':
          return { title: 'Creator Profile Inspection', subtitle: 'Detailed verification evidence, strengths, and risk audit' };
        case 'shortlist-compare':
          return { title: 'Shortlist & Compare', subtitle: 'Side-by-side evaluation matrix across saved creators' };
        case 'brand-requests':
          return { title: 'Collaboration Requests', subtitle: 'Review creator proposals, invitations, and counteroffers' };
        case 'brand-projects':
          return { title: 'Projects & Deliverables', subtitle: 'Milestone tracking, version reviews, and escrow disbursement' };
        case 'brand-notifications':
          return { title: 'Notifications', subtitle: 'Important updates on campaign submissions and approvals' };
        case 'brand-settings':
          return { title: 'Brand Settings', subtitle: 'Manage billing, escrow rules, and security credentials' };
        default:
          return { title: 'Brand Workspace', subtitle: 'CreatorProof AI Enterprise Procurement' };
      }
    };

    const header = getBrandHeader();

    return (
      <div className="workspace-layout">
        <BrandSidebar />
        <div className="workspace-main">
          <WorkspaceTopbar title={header.title} subtitle={header.subtitle} />
          {currentPage === 'brand-dashboard' && <BrandDashboardPage />}
          {currentPage === 'brand-profile' && <BrandProfilePage />}
          {currentPage === 'my-campaigns' && <MyCampaignsPage />}
          {currentPage === 'create-campaign' && <CreateCampaignPage />}
          {currentPage === 'ai-brief-builder' && <AIBriefBuilderPage />}
          {currentPage === 'explore-creators' && <ExploreCreatorsPage />}
          {currentPage === 'brand-creator-detail' && <BrandCreatorDetailPage />}
          {currentPage === 'shortlist-compare' && <ShortlistComparePage />}
          {currentPage === 'brand-requests' && <BrandRequestsPage />}
          {currentPage === 'brand-projects' && <BrandProjectsPage />}
          {currentPage === 'brand-notifications' && <BrandNotificationsPage />}
          {currentPage === 'brand-settings' && <BrandSettingsPage />}
        </div>
      </div>
    );
  }

  // 3. AI CREATOR WORKSPACE VIEW
  if (currentRole === 'creator') {
    const getCreatorHeader = () => {
      switch (currentPage) {
        case 'creator-dashboard':
          return { title: 'Creator Dashboard', subtitle: 'Performance metrics, incoming invitations, and active engagements' };
        case 'creator-profile':
        case 'my-creator-profile':
          return { title: 'Creator Profile Builder & Opportunity Discovery', subtitle: 'AI portfolio intelligence, profile improvement suggestions, and brand opportunity scout' };
        case 'portfolio-manager':
          return { title: 'Portfolio Manager', subtitle: 'Showcase generation renders and case study workflows' };
        case 'evidence-verification':
          return { title: 'Evidence & Verification', subtitle: 'Cryptographic node graphs, raw seeds, and proof audit status' };
        case 'available-campaigns':
          return { title: 'Available Campaigns', subtitle: 'Explore funded brand briefs with explainable suitability matching' };
        case 'creator-campaign-detail':
          return { title: 'Campaign Brief Details', subtitle: 'Review client requirements, technical specifications, and budget' };
        case 'submit-proposal':
          return { title: 'Submit Proposal', subtitle: 'Pitch your creative approach, delivery timeline, and milestones' };
        case 'creator-requests':
          return { title: 'Collaboration Requests', subtitle: 'Manage brand invitations, counteroffers, and proposal statuses' };
        case 'creator-projects':
          return { title: 'Active Engagements & Projects', subtitle: 'Deliverable version uploads and escrow payout tracking' };
        case 'creator-notifications':
          return { title: 'Creator Notifications', subtitle: 'Payout credits, invitation alerts, and evidence audit updates' };
        case 'creator-settings':
          return { title: 'Creator Settings', subtitle: 'Payout account routing, 2FA credentials, and discovery settings' };
        case 'public-profile-preview':
          return { title: 'Public Profile Preview', subtitle: 'Live true-to-brand preview of your profile and proof badge' };
        default:
          return { title: 'Creator Workspace', subtitle: 'CreatorProof AI Verified Creator Hub' };
      }
    };

    const header = getCreatorHeader();

    return (
      <div className="workspace-layout">
        <CreatorSidebar />
        <div className="workspace-main">
          <WorkspaceTopbar title={header.title} subtitle={header.subtitle} />
          {currentPage === 'creator-dashboard' && <CreatorDashboardPage />}
          {(currentPage === 'creator-profile' || currentPage === 'my-creator-profile') && <MyCreatorProfilePage />}
          {currentPage === 'portfolio-manager' && <PortfolioManagerPage />}
          {currentPage === 'evidence-verification' && <EvidenceVerificationPage />}
          {currentPage === 'available-campaigns' && <AvailableCampaignsPage />}
          {currentPage === 'creator-campaign-detail' && <CreatorCampaignDetailPage />}
          {currentPage === 'submit-proposal' && <SubmitProposalPage />}
          {currentPage === 'creator-requests' && <CreatorRequestsPage />}
          {currentPage === 'creator-projects' && <CreatorProjectsPage />}
          {currentPage === 'creator-notifications' && <CreatorNotificationsPage />}
          {currentPage === 'creator-settings' && <CreatorSettingsPage />}
          {currentPage === 'public-profile-preview' && <PublicProfilePreviewPage />}
        </div>
      </div>
    );
  }

  return null;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAFAFA',
          padding: '24px',
          textAlign: 'center',
          fontFamily: 'var(--font-sans)'
        }}>
          <div style={{
            maxWidth: '500px',
            backgroundColor: '#FFFFFF',
            padding: '36px',
            borderRadius: '24px',
            border: '1px solid #E4E4E7',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: '#09090B' }}>
              Something went wrong
            </h2>
            <p style={{ color: '#71717A', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
              An unexpected render error occurred. Click below to refresh and reset the workspace.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="btn btn-dark"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
            >
              Reset & Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <MainContent />
        <ToastContainer />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;

