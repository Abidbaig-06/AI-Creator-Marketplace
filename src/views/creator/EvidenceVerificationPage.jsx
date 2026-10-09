import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EvidenceBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  ShieldCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCode2,
  ExternalLink,
  HelpCircle,
  Layers,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export const EvidenceVerificationPage = () => {
  const {
    evidenceRecords,
    activeCreatorProfile,
    submitEvidence,
    addToast
  } = useApp();

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [claimTitle, setClaimTitle] = useState('');
  const [claimCategory, setClaimCategory] = useState('Tool Mastery');
  const [claimDescription, setClaimDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceType, setEvidenceType] = useState('GitHub Node Graph & Workflow JSON');

  const myEvidence = evidenceRecords.filter(
    (e) => e.creatorId === activeCreatorProfile.id
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!claimTitle.trim()) return;

    submitEvidence({
      claimTitle,
      category: claimCategory,
      claimDescription,
      evidenceUrl,
      evidenceType
    });

    addToast({
      title: 'Verification Claim Submitted',
      message: 'Claim is now pending automated provenance inspection.',
      type: 'info'
    });

    setIsSubmitModalOpen(false);
    setClaimTitle('');
    setClaimDescription('');
    setEvidenceUrl('');
  };

  return (
    <div className="page-content animate-fade-in" style={{ maxWidth: '1080px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <ShieldCheck size={15} />
            <span>BONUS FEATURE: VERIFICATION SIGNALS & TRUST ENGINE</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Creator Trust & Verification Signals
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Submit verifiable proof of AI workflow authorship, ComfyUI node graphs, raw generation seeds, and client sign-offs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSubmitModalOpen(true)}
          className="btn btn-primary"
          style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
        >
          <PlusCircle size={16} />
          <span>Submit Verification Evidence</span>
        </button>
      </div>

      {/* Trust Status Explanation Card */}
      <div className="card" style={{
        backgroundColor: '#FFFFFF',
        padding: '24px 28px',
        marginBottom: '28px',
        border: '1.5px solid #C7D2FE',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '8px' }}>
          <Info size={16} />
          <span>Verification Status Rules & Criteria</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: '16px' }}>
          To maintain marketplace trust, claims are never marked as <strong>Verified</strong> automatically upon registration. Verification requires actual cryptographic proof or audited client sign-offs.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ color: '#059669', fontWeight: 800, fontSize: '0.85rem', marginBottom: '2px' }}>● Verified Claim</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cryptographically validated workflow hash, C2PA manifest, or published client contract.</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ color: '#D97706', fontWeight: 800, fontSize: '0.85rem', marginBottom: '2px' }}>● Verification Pending</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Evidence URL or export provided; automated audit queue in progress.</div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ color: '#64748B', fontWeight: 800, fontSize: '0.85rem', marginBottom: '2px' }}>● Self-Reported</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Creator declared proficiency without accompanying reproducible proof.</div>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {myEvidence.map((ev) => (
          <div
            key={ev.id}
            className="card"
            style={{
              padding: '24px',
              backgroundColor: '#FFFFFF',
              borderLeft:
                ev.status === 'verified' ? '4px solid #059669' :
                ev.status === 'evidence-linked' ? '4px solid #D97706' :
                ev.status === 'under-review' ? '4px solid #D97706' : '4px solid #64748B'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    {ev.claimTitle}
                  </h3>
                  <EvidenceBadge status={ev.status} size="small" />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Category: <strong>{ev.category}</strong> • Submitted: {ev.submittedDate}
                </div>
              </div>

              {ev.evidenceUrl && (
                <a
                  href={ev.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <ExternalLink size={14} />
                  <span>Inspect Audit Proof</span>
                </a>
              )}
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '8px 0 12px' }}>
              {ev.claimDescription}
            </p>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-secondary)', padding: '6px 12px', borderRadius: '6px', display: 'inline-block' }}>
              Evidence Type: <strong>{ev.evidenceType}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Evidence Modal */}
      {isSubmitModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsSubmitModalOpen(false)}
          title="Submit New Evidence for Verification"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Claim Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ComfyUI Node Graph for 8K Liquid Dynamics Refraction"
                value={claimTitle}
                onChange={(e) => setClaimTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={claimCategory}
                  onChange={(e) => setClaimCategory(e.target.value)}
                >
                  <option value="Tool Mastery">Tool & Model Mastery</option>
                  <option value="Workflow Authorship">Workflow Authorship & Nodes</option>
                  <option value="Commercial Track Record">Commercial Track Record</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Evidence Type</label>
                <select
                  className="form-select"
                  value={evidenceType}
                  onChange={(e) => setEvidenceType(e.target.value)}
                >
                  <option value="GitHub Node Graph & Workflow JSON">GitHub Node Graph & Workflow JSON</option>
                  <option value="C2PA Cryptographic Manifest">C2PA Cryptographic Manifest</option>
                  <option value="Client NDA Sign-off Document">Client Contract Sign-off</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Proof / Repository URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/username/workflow-audit"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description of Workflow & Seeds</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Explain the node structure, LoRA checkpoints, model weights, and reproducibility..."
                value={claimDescription}
                onChange={(e) => setClaimDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
              >
                <ShieldCheck size={15} />
                <span>Submit for Audit</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default EvidenceVerificationPage;
