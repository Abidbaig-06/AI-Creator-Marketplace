import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Briefcase,
  AlertCircle,
  Eye,
  ArrowRight,
  DollarSign,
  Building2,
  Calendar
} from 'lucide-react';

export const CreatorRequestsPage = () => {
  const {
    collaborationRequests,
    activeCreatorProfile,
    respondToRequest,
    navigateTo,
    addToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('All');
  const [selectedRequestForCounter, setSelectedRequestForCounter] = useState(null);
  const [counterBudget, setCounterBudget] = useState('');
  const [counterNotes, setCounterNotes] = useState('');

  const myRequests = collaborationRequests.filter(
    (r) => r.creatorId === activeCreatorProfile.id || r.type === 'Brand Invitation'
  );

  const filteredRequests = useMemo(() => {
    return myRequests.filter((req) => {
      if (activeTab === 'All') return true;
      if (activeTab === 'Incoming') return req.status === 'Incoming' || req.type === 'Brand Invitation';
      if (activeTab === 'Accepted') return req.status === 'Accepted';
      if (activeTab === 'Declined') return req.status === 'Declined';
      if (activeTab === 'Counteroffer') return req.status === 'Counteroffer';
      return true;
    });
  }, [myRequests, activeTab]);

  const handleAccept = (req) => {
    respondToRequest(req.id, 'Accepted');
    addToast({
      title: 'Invitation Accepted!',
      message: `Project created for "${req.campaignTitle}"! Escrow milestone initialized.`,
      type: 'success'
    });
  };

  const handleDecline = (req) => {
    respondToRequest(req.id, 'Declined');
    addToast({
      title: 'Request Declined',
      message: `Declined request from ${req.brandName}.`,
      type: 'info'
    });
  };

  const handleCounterSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequestForCounter) return;

    respondToRequest(selectedRequestForCounter.id, 'Counteroffer', {
      counterBudget: Number(counterBudget),
      counterNotes
    });

    addToast({
      title: 'Counteroffer Sent',
      message: `Counteroffer of $${counterBudget} sent to ${selectedRequestForCounter.brandName}.`,
      type: 'success'
    });

    setSelectedRequestForCounter(null);
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
          <Inbox size={15} />
          <span>Brand Invitations & Opportunities</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Collaboration Invitations & Brief Requests
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
          Review direct brand invitations, accept funded project terms, or propose custom milestone counteroffers.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['All', 'Incoming', 'Accepted', 'Counteroffer', 'Declined'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              borderColor: activeTab === tab ? '#7C3AED' : 'var(--border-light)',
              backgroundColor: activeTab === tab ? 'var(--secondary-light)' : '#FFFFFF',
              color: activeTab === tab ? '#6D28D9' : 'var(--text-secondary)',
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

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#FFFFFF' }}>
          <Inbox size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>
            No invitations found in this tab
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Check other tabs or explore open brand briefs in the marketplace.
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
                  req.status === 'Incoming' ? '4px solid #7C3AED' : '4px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Building2 size={15} color="var(--primary)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 700 }}>{req.brandName}</span>
                    <span style={{ color: 'var(--border-light)' }}>•</span>
                    <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
                      {req.type}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {req.campaignTitle}
                  </h3>
                </div>

                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor:
                    req.status === 'Accepted' ? '#ECFDF5' :
                    req.status === 'Counteroffer' ? '#FFFBEB' :
                    req.status === 'Incoming' ? 'var(--secondary-light)' : 'var(--bg-secondary)',
                  color:
                    req.status === 'Accepted' ? '#059669' :
                    req.status === 'Counteroffer' ? '#D97706' :
                    req.status === 'Incoming' ? '#7C3AED' : 'var(--text-secondary)',
                  border: '1px solid currentColor'
                }}>
                  {req.status === 'Incoming' ? 'Action Required: Pending Response' : req.status}
                </span>
              </div>

              {/* Message from Brand */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <strong>Client Message:</strong> "{req.message}"
              </div>

              {/* Counteroffer details if any */}
              {req.status === 'Counteroffer' && req.counterBudget && (
                <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.88rem', color: '#92400E' }}>
                  <strong>Proposed Counteroffer:</strong> ${req.counterBudget} USD • "{req.counterNotes}"
                </div>
              )}

              {/* Deliverables & Budget Bar */}
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
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Offered Escrow: </span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--primary)' }}>${req.budget}</span>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    Target Delivery: <strong>{req.deadline}</strong>
                  </div>
                </div>

                {/* Actions for Incoming Invitations */}
                {req.status === 'Incoming' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
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
                      onClick={() => {
                        setSelectedRequestForCounter(req);
                        setCounterBudget(req.budget + 800);
                        setCounterNotes('Includes 2 extra 4K variation cuts and trained LoRA weights checkpoint archive.');
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      <RefreshCw size={14} />
                      <span>Counteroffer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAccept(req)}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#059669', borderColor: '#059669', fontWeight: 700 }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Accept Invitation & Start Project</span>
                    </button>
                  </div>
                )}

                {req.status === 'Accepted' && (
                  <button
                    type="button"
                    onClick={() => navigateTo('creator-projects')}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#059669', borderColor: '#A7F3D0' }}
                  >
                    <Briefcase size={14} />
                    <span>View Active Project Workspace</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Counteroffer Modal */}
      {selectedRequestForCounter && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRequestForCounter(null)}
          title={`Submit Counteroffer to ${selectedRequestForCounter.brandName}`}
        >
          <form onSubmit={handleCounterSubmit}>
            <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{selectedRequestForCounter.campaignTitle}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Initial Brand Budget: ${selectedRequestForCounter.budget}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Proposed Counter Budget ($ USD):</label>
              <input
                type="number"
                className="form-input"
                value={counterBudget}
                onChange={(e) => setCounterBudget(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Scope Enhancements & Rationale:</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={counterNotes}
                onChange={(e) => setCounterNotes(e.target.value)}
                placeholder="Explain what additional value or deliverables are included in this counteroffer..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setSelectedRequestForCounter(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: '#D97706', borderColor: '#D97706' }}
              >
                <span>Send Counteroffer</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CreatorRequestsPage;
