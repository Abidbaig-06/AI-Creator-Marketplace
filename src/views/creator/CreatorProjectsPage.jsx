import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Upload,
  Sparkles,
  Layers,
  FileText,
  DollarSign,
  Calendar,
  RotateCcw,
  Check,
  Building2,
  Eye,
  ShieldCheck
} from 'lucide-react';

export const CreatorProjectsPage = () => {
  const {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    uploadDeliverableVersion,
    activeCreatorProfile,
    navigateTo,
    addToast
  } = useApp();

  const myProjects = projects.filter((p) => p.creatorId === activeCreatorProfile.id || p.id === 'proj-101');
  const activeProject = myProjects.find((p) => p.id === selectedProjectId) || myProjects[0] || {
    id: 'proj-101',
    title: 'Aura Luxe 30s Instagram Jewellery Commercial Suite',
    brandName: 'Aura Luxe Jewels',
    targetDeadline: '2026-11-28',
    status: 'In Progress',
    budgetTotal: 4800,
    escrowReleased: 1440,
    milestones: [
      { id: 'm-1', title: 'Milestone 1: Concept, Moodboard & Styleframes', payout: 1440, dueDate: '2026-11-10', status: 'Approved' },
      { id: 'm-2', title: 'Milestone 2: 4K Master Renders & 9:16 Social Cuts', payout: 1920, dueDate: '2026-11-20', status: 'Submitted' },
      { id: 'm-3', title: 'Milestone 3: Trained Brand LoRA & Source Assets', payout: 1440, dueDate: '2026-11-28', status: 'Pending' }
    ],
    deliverableVersions: [
      {
        id: 'v-1',
        title: 'Master 4K Video Cut (Milestone 2)',
        submittedAt: 'Today at 2:30 PM',
        notes: 'Updated macro diamond light refractions and added 9:16 vertical crop with ProRes master.',
        previewImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
      }
    ]
  };

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(activeProject.milestones[1]?.id || activeProject.milestones[0]?.id);
  const [versionTitle, setVersionTitle] = useState('Master 4K Video Cut (Milestone 2)');
  const [versionNotes, setVersionNotes] = useState('Color timing calibrated, macro diamond refraction enhanced, C2PA manifest signed.');
  const [previewImageUrl, setPreviewImageUrl] = useState('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80');

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    uploadDeliverableVersion(activeProject.id, selectedMilestoneId, {
      title: versionTitle,
      notes: versionNotes,
      fileName: 'AuraLuxe_Master_4K_ProRes.mp4',
      previewImage: previewImageUrl
    });

    addToast({
      title: 'Deliverable Submitted',
      message: 'Version submitted for client review and escrow milestone approval!',
      type: 'success'
    });

    setIsUploadModalOpen(false);
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <FolderKanban size={15} />
            <span>Active Collaborations</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Active Projects & Deliverables
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Upload deliverable files, address client revision requests, mark milestones ready for review, and receive escrow payouts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="btn btn-primary"
            style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
          >
            <Upload size={16} />
            <span>Submit Deliverable / Version</span>
          </button>
        </div>
      </div>

      {/* Project Status Summary Card */}
      <div className="card" style={{ marginBottom: '28px', padding: '24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {activeProject.title}
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 'var(--radius-full)', backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                {activeProject.status}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Client: <strong>{activeProject.brandName}</strong> • Target Delivery: <strong>{activeProject.targetDeadline}</strong>
            </div>
          </div>
        </div>

        {/* Financial Escrow Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', backgroundColor: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: 'var(--radius-md)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Contract Value</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>${activeProject.budgetTotal}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Earned & Released</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669' }}>${activeProject.escrowReleased}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Remaining in Escrow</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)' }}>${activeProject.budgetTotal - activeProject.escrowReleased}</div>
          </div>
        </div>
      </div>

      {/* Two Columns: Milestones Checklist & Version Submissions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
        {/* Left: Milestones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Milestones & Deliverable Tasks
          </h3>

          {activeProject.milestones?.map((m) => (
            <div
              key={m.id}
              className="card"
              style={{
                padding: '20px',
                backgroundColor: '#FFFFFF',
                borderLeft: m.status === 'Approved' ? '4px solid #059669' : m.status === 'Submitted' ? '4px solid #7C3AED' : '4px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{m.title}</h4>
                <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>
                  {m.status}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Escrow Payout: <strong style={{ color: 'var(--primary)' }}>${m.payout}</strong> • Due: {m.dueDate}
              </div>

              {m.feedback && (
                <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.825rem', color: '#92400E', marginBottom: '10px' }}>
                  <strong>Client Revision Feedback:</strong> "{m.feedback}"
                </div>
              )}

              {m.status !== 'Approved' && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMilestoneId(m.id);
                    setIsUploadModalOpen(true);
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', marginTop: '6px' }}
                >
                  <Upload size={13} />
                  <span>{m.status === 'Submitted' ? 'Upload Updated Revision' : 'Submit Deliverable for Review'}</span>
                </button>
              )}

              {m.status === 'Approved' && (
                <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                  <CheckCircle2 size={14} />
                  <span>Milestone Approved & Escrow Paid</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right: Submitted Deliverables Archive */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Deliverable Version Submissions
          </h3>

          {(activeProject.deliverableVersions || [
            {
              id: 'v-1',
              title: 'Master 4K Video Cut (Milestone 2)',
              submittedAt: 'Today at 2:30 PM',
              notes: 'Updated macro diamond light refractions and added 9:16 vertical crop with ProRes master.',
              previewImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
            }
          ]).map((v, idx) => (
            <div key={idx} className="card" style={{ padding: '20px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  {v.title}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {v.submittedAt}
                </span>
              </div>

              <div style={{ height: '180px', backgroundColor: '#0F172A', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', marginBottom: '12px' }}>
                <img
                  src={v.previewImage}
                  alt={v.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                {v.notes}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#059669', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                <ShieldCheck size={14} />
                <span>C2PA Cryptographic Lineage Manifest Signed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Deliverable Modal */}
      {isUploadModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsUploadModalOpen(false)}
          title="Submit Deliverable Version for Review"
        >
          <form onSubmit={handleUploadSubmit}>
            <div className="form-group">
              <label className="form-label">Deliverable Version Title *</label>
              <input
                type="text"
                className="form-input"
                value={versionTitle}
                onChange={(e) => setVersionTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preview Image / Video Render URL</label>
              <input
                type="text"
                className="form-input"
                value={previewImageUrl}
                onChange={(e) => setPreviewImageUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Submission Notes & Revision Changes</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                placeholder="Describe changes, format specs (4K ProRes, 9:16 vertical), and LoRA checkpoints..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
              >
                <Upload size={15} />
                <span>Submit Version for Review</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CreatorProjectsPage;
