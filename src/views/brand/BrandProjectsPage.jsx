import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Eye,
  Sparkles,
  Layers,
  Clock,
  DollarSign,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Building2,
  Send,
  Video
} from 'lucide-react';

export const BrandProjectsPage = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    approveMilestone,
    requestProjectRevision,
    navigateTo,
    addToast
  } = useApp();

  const activeProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0] || {
      id: 'proj-101',
      title: 'Aura Luxe 30s Instagram Jewellery Commercial Suite',
      creatorName: 'Sophia Chan',
      targetDeadline: '2026-11-28',
      status: 'In Progress',
      progressPercent: 65,
      budgetTotal: 4800,
      escrowReleased: 1440,
      milestones: [
        { id: 'm-1', title: 'Milestone 1: Concept, Moodboard & Styleframes', amount: 1440, status: 'Approved' },
        { id: 'm-2', title: 'Milestone 2: 4K Master Renders & 9:16 Social Cuts', amount: 1920, status: 'Submitted' },
        { id: 'm-3', title: 'Milestone 3: Trained Brand LoRA & Source Assets', amount: 1440, status: 'Pending' }
      ],
      deliverableVersions: [
        {
          id: 'v-1',
          versionNumber: 'v2.1 Master Render',
          submittedAt: 'Today at 2:30 PM',
          note: 'Updated macro diamond light refractions and added 9:16 vertical crop with ProRes master.',
          previewUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
          evidenceHash: '0x7b84...92e (C2PA Signed)'
        }
      ]
    };

  const [revisionMilestoneId, setRevisionMilestoneId] = useState(null);
  const [revisionFeedback, setRevisionFeedback] = useState('');
  const [previewVersion, setPreviewVersion] = useState(null);

  const handleApprove = (milestoneId) => {
    approveMilestone(activeProject.id, milestoneId);
    addToast({
      title: 'Milestone Approved!',
      message: 'Escrow payout released to creator for approved milestone.',
      type: 'success'
    });
  };

  const handleSendRevision = (e) => {
    e.preventDefault();
    if (!revisionMilestoneId) return;
    requestProjectRevision(activeProject.id, revisionMilestoneId, revisionFeedback);
    addToast({
      title: 'Revision Requested',
      message: 'Creator has been notified of your requested changes.',
      type: 'info'
    });
    setRevisionMilestoneId(null);
    setRevisionFeedback('');
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <FolderKanban size={15} />
            <span>Escrow Project Workspace</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Active Projects & Deliverable Approvals
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Inspect submitted generative videos, approve milestone releases, request revisions, and download signed C2PA assets.
          </p>
        </div>

        {/* Project Selector */}
        <div style={{ minWidth: '240px' }}>
          <label className="form-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Select Project:</label>
          <select
            className="form-select"
            value={activeProject.id}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="card" style={{ marginBottom: '28px', padding: '24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {activeProject.title}
              </h2>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                backgroundColor:
                  activeProject.status === 'Completed' ? '#ECFDF5' :
                  activeProject.status === 'Submitted' ? 'var(--primary-light)' : '#FFFBEB',
                color:
                  activeProject.status === 'Completed' ? '#059669' :
                  activeProject.status === 'Submitted' ? 'var(--primary)' : '#D97706',
                border: '1px solid currentColor'
              }}>
                {activeProject.status}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Lead Creator: <strong>{activeProject.creatorName}</strong> • Target Deadline: <strong>{activeProject.targetDeadline}</strong>
            </div>
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Project Completion:</span>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{activeProject.progressPercent}% Completed</span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${activeProject.progressPercent}%`, backgroundColor: 'var(--primary)', transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {/* Escrow Financial Tracker */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', backgroundColor: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Escrow Locked</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>${activeProject.budgetTotal}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Released to Creator</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669' }}>${activeProject.escrowReleased}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Remaining in Escrow</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>${activeProject.budgetTotal - activeProject.escrowReleased}</div>
          </div>
        </div>
      </div>

      {/* Two Columns: Milestones & Deliverable Version Files */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
        {/* Left: Milestones & Approvals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Milestones & Escrow Release
          </h3>

          {activeProject.milestones?.map((m, idx) => (
            <div
              key={m.id || idx}
              className="card"
              style={{
                padding: '20px',
                backgroundColor: '#FFFFFF',
                borderLeft: m.status === 'Approved' ? '4px solid #059669' : m.status === 'Submitted' ? '4px solid var(--primary)' : '4px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {m.title}
                </h4>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>
                  ${m.amount}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>
                  Status: {m.status}
                </span>

                {m.status === 'Submitted' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setRevisionMilestoneId(m.id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: '#D97706' }}
                    >
                      <RotateCcw size={13} />
                      <span>Request Revision</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(m.id)}
                      className="btn btn-primary btn-sm"
                      style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                    >
                      <CheckCircle2 size={13} />
                      <span>Approve & Release Escrow</span>
                    </button>
                  </div>
                )}

                {m.status === 'Approved' && (
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} />
                    <span>Escrow Released</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Submitted Deliverable Files */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Submitted Deliverable Versions
          </h3>

          {(activeProject.deliverableVersions || [
            {
              id: 'v-1',
              versionNumber: 'v2.1 Master Deliverable',
              submittedAt: 'Today at 2:30 PM',
              note: 'Updated macro diamond light refractions and added 9:16 vertical crop with ProRes master.',
              previewUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
              evidenceHash: '0x7b84...92e (C2PA Signed)'
            }
          ]).map((ver) => (
            <div key={ver.id} className="card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {ver.versionNumber}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {ver.submittedAt}
                </span>
              </div>

              <div style={{ height: '180px', backgroundColor: '#0F172A', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', marginBottom: '12px' }}>
                <img
                  src={ver.previewUrl}
                  alt={ver.versionNumber}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                {ver.note}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <ShieldCheck size={14} />
                  <span>{ver.evidenceHash}</span>
                </span>

                <button
                  type="button"
                  onClick={() => addToast({ title: 'Downloading 4K Master Assets', message: 'Downloading ProRes master and LoRA checkpoint weights archive.', type: 'success' })}
                  className="btn btn-outline btn-sm"
                >
                  <Download size={13} />
                  <span>Download Master (4K)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revision Request Modal */}
      {revisionMilestoneId && (
        <Modal
          isOpen={true}
          onClose={() => setRevisionMilestoneId(null)}
          title="Request Milestone Revision"
        >
          <form onSubmit={handleSendRevision}>
            <div className="form-group">
              <label className="form-label">Revision Feedback & Required Adjustments:</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Describe color grading tweaks, pacing changes, or deliverable adjustments..."
                value={revisionFeedback}
                onChange={(e) => setRevisionFeedback(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setRevisionMilestoneId(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: '#D97706', borderColor: '#D97706' }}
              >
                <span>Send Revision Request</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default BrandProjectsPage;
