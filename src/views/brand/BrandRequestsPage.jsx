import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  Send,
  Inbox,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FolderKanban,
  DollarSign,
  Calendar,
  AlertCircle,
  ArrowRight,
  User,
  Briefcase
} from 'lucide-react';

export const BrandRequestsPage = () => {
  const {
    collaborationRequests,
    respondToRequest,
    navigateTo,
    setSelectedProjectId,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('All');
  const [selectedRequestForCounter, setSelectedRequestForCounter] = useState(null);
  const [counterAmount, setCounterAmount] = useState('');
  const [counterMessage, setCounterMessage] = useState('');

  const filteredRequests = useMemo(() => {
    return collaborationRequests.filter((req) => {
      if (activeTab === 'All') return true;
      if (activeTab === 'Incoming') return req.type === 'Creator Proposal' && req.status !== 'Declined';
      if (activeTab === 'Counteroffer') return req.status === 'Counteroffer';
      if (activeTab === 'Sent') return req.type === 'Brand Invitation';
      if (activeTab === 'Accepted') return req.status === 'Accepted';
      if (activeTab === 'Declined') return req.status === 'Declined';
      return true;
    });
  }, [collaborationRequests, activeTab]);

  const handleAccept = (req) => {
    respondToRequest(req.id, 'Accepted');
    addToast({
      title: 'Proposal Accepted!',
      message: `Project created with ${req.creatorName}. Escrow funded into milestone reserve.`,
      type: 'success'
    });
  };

  const handleDecline = (req) => {
    respondToRequest(req.id, 'Declined');
    addToast({
      title: 'Request Declined',
      message: `Declined proposal from ${req.creatorName}.`,
      type: 'info'
    });
  };

  const handleSendCounteroffer = (e) => {
    e.preventDefault();
    if (!selectedRequestForCounter) return;

    respondToRequest(selectedRequestForCounter.id, 'Counteroffer', {
      counterBudget: Number(counterAmount),
      counterNotes: counterMessage
    });

    addToast({
      title: 'Counteroffer Sent',
      message: `Counteroffer of $${counterAmount} sent to ${selectedRequestForCounter.creatorName}.`,
      type: 'success'
    });

    setSelectedRequestForCounter(null);
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
          <Send size={15} />
          <span>Collaboration Pipeline</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Applications & Collaboration Requests
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Review inbound creator proposals, respond to milestone counteroffers, and manage outbound invitations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['All', 'Incoming', 'Counteroffer', 'Sent', 'Accepted', 'Declined'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: activeTab === tab ? 'var(--primary)' : 'var(--border-light)',
              backgroundColor: activeTab === tab ? 'var(--primary-light)' : '#FFFFFF',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Requests Listing */}
      {filteredRequests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFFFFF' }}>
          <Inbox size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
            No collaboration requests in this view
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Discover creators to send invitations or publish a creative brief to receive applications.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="card"
              style={{
                padding: '24px',
                backgroundColor: '#FFFFFF',
                borderLeft:
                  req.status === 'Accepted' ? '4px solid #059669' :
                  req.status === 'Counteroffer' ? '4px solid #D97706' :
                  req.status === 'Sent' ? '4px solid var(--primary)' : '4px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img
                    src={req.creatorAvatar}
                    alt={req.creatorName}
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        {req.creatorName}
                      </h3>
                      <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                        {req.type}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Campaign: <strong>{req.campaignTitle}</strong>
                    </div>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor:
                    req.status === 'Accepted' ? '#ECFDF5' :
                    req.status === 'Counteroffer' ? '#FFFBEB' :
                    req.status === 'Declined' ? '#FEF2F2' : 'var(--primary-light)',
                  color:
                    req.status === 'Accepted' ? '#059669' :
                    req.status === 'Counteroffer' ? '#D97706' :
                    req.status === 'Declined' ? '#DC2626' : 'var(--primary)',
                  border: '1px solid currentColor'
                }}>
                  {req.status}
                </span>
              </div>

              {/* Message Note */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <strong>Message:</strong> "{req.message}"
              </div>

              {/* Counteroffer Highlight Box */}
              {req.status === 'Counteroffer' && req.counterBudget && (
                <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '14px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.88rem', color: '#92400E' }}>
                  <div style={{ fontWeight: 800, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <RefreshCw size={15} />
                    <span>Creator Counteroffer: ${req.counterBudget} USD</span>
                  </div>
                  <div>"{req.counterNotes}"</div>
                </div>
              )}

              {/* Action Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Proposed Budget: </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)' }}>
                      ${req.status === 'Counteroffer' && req.counterBudget ? req.counterBudget : req.budget}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Target Timeline: <strong>{req.deadline}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {req.status !== 'Accepted' && req.status !== 'Declined' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDecline(req)}
                        className="btn btn-outline btn-sm"
                        style={{ color: '#EF4444' }}
                      >
                        <XCircle size={14} />
                        <span>Decline</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAccept(req)}
                        className="btn btn-primary btn-sm"
                        style={{ backgroundColor: '#059669', borderColor: '#059669', fontWeight: 700 }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Accept Proposal & Start Escrow</span>
                      </button>
                    </>
                  )}

                  {req.status === 'Accepted' && (
                    <button
                      type="button"
                      onClick={() => navigateTo('brand-projects')}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#059669', borderColor: '#A7F3D0' }}
                    >
                      <Briefcase size={14} />
                      <span>View Active Project Workspace</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandRequestsPage;
