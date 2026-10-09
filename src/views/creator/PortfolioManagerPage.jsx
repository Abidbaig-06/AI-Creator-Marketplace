import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import {
  Image,
  PlusCircle,
  Trash2,
  Edit,
  Sparkles,
  ExternalLink,
  Upload,
  CheckCircle2,
  FileCode2,
  Eye,
  Play,
  Video,
  FileText,
  ShieldCheck,
  X
} from 'lucide-react';

export const PortfolioManagerPage = () => {
  const {
    activeCreatorProfile,
    addPortfolioItem,
    deletePortfolioItem,
    navigateTo,
    addToast
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  const [formItemData, setFormItemData] = useState({
    title: '',
    category: 'Commercial Video & 3D Visuals',
    mediaType: 'Video / Render',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    tools: 'Flux.1 Pro, ComfyUI, Runway Gen-3',
    techniques: 'ControlNet Depth, IP-Adapter, Brand LoRA Training',
    description: '',
    workflowDetails: 'Custom ComfyUI node graph with 4K Magnific AI upscaling and temporal coherence pass.',
    commercialRights: 'Full Commercial Global Buyout Included',
    evidenceLink: 'https://github.com/creator-ai/verified-workflow-hash',
    evidenceType: 'Verified Workflow Hash',
    promptSummary: ''
  });

  const [uploadedResumeName, setUploadedResumeName] = useState('Sophia_Chan_AI_Art_Director_CV.pdf');

  const categories = [
    'Commercial Video & 3D Visuals',
    'AI Film & Cinematic VFX',
    'AI Fashion & Lookbooks',
    'Product Visuals & Luxury Renders',
    'Character Design & Avatars',
    'Packaging & Identity'
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formItemData.title.trim()) return;

    addPortfolioItem({
      title: formItemData.title,
      category: formItemData.category,
      image: formItemData.image,
      tools: formItemData.tools.split(',').map((t) => t.trim()),
      description: formItemData.description,
      techniques: formItemData.techniques,
      workflowDetails: formItemData.workflowDetails,
      commercialRights: formItemData.commercialRights,
      evidenceLink: formItemData.evidenceLink,
      evidenceType: formItemData.evidenceType,
      promptSummary: formItemData.promptSummary
    });

    addToast({
      title: 'Portfolio Piece Added',
      message: `${formItemData.title} is now visible on your public profile!`,
      type: 'success'
    });

    setIsAddModalOpen(false);
    setFormItemData({
      title: '',
      category: 'Commercial Video & 3D Visuals',
      mediaType: 'Video / Render',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      tools: 'Flux.1 Pro, ComfyUI, Runway Gen-3',
      techniques: 'ControlNet Depth, IP-Adapter, Brand LoRA Training',
      description: '',
      workflowDetails: 'Custom ComfyUI node graph with 4K Magnific AI upscaling.',
      commercialRights: 'Full Commercial Global Buyout Included',
      evidenceLink: 'https://github.com/creator-ai/verified-workflow-hash',
      evidenceType: 'Verified Workflow Hash',
      promptSummary: ''
    });
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to remove "${title}" from your portfolio?`)) {
      deletePortfolioItem(id);
      addToast({
        title: 'Item Removed',
        message: `Removed ${title} from portfolio.`,
        type: 'info'
      });
    }
  };

  return (
    <div className="page-content animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
            <Image size={15} />
            <span>Showcase & Evidence Management</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            AI Portfolio & Case Study Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '4px' }}>
            Upload AI-generated videos, images, and animations. Specify ComfyUI workflows, LoRAs, and commercial rights permissions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigateTo('public-profile-preview')}
            className="btn btn-outline"
          >
            <Eye size={16} />
            <span>Public Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
            style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
          >
            <PlusCircle size={16} />
            <span>+ Add Portfolio Piece</span>
          </button>
        </div>
      </div>

      {/* Resume / Portfolio Document Upload Section */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: '28px', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'var(--secondary-light)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
              Resume / Artist Credential Document
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Current: <strong>{uploadedResumeName}</strong> (Attached to proposals)
            </div>
          </div>
        </div>

        <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
          <Upload size={14} />
          <span>Upload Updated PDF / Resume</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setUploadedResumeName(e.target.files[0].name);
                addToast({
                  title: 'Document Uploaded',
                  message: `Uploaded ${e.target.files[0].name} successfully.`,
                  type: 'success'
                });
              }
            }}
          />
        </label>
      </div>

      {/* Portfolio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {(activeCreatorProfile.portfolio || []).map((item) => (
          <div
            key={item.id}
            className="card card-hover"
            style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}
          >
            {/* Image / Video Thumbnail */}
            <div
              onClick={() => setSelectedPreviewItem(item)}
              style={{ position: 'relative', height: '220px', backgroundColor: '#0F172A', cursor: 'pointer' }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                color: '#FFFFFF',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.7rem',
                fontWeight: 700
              }}>
                {item.category}
              </div>

              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#7C3AED',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <Play size={14} fill="currentColor" style={{ marginLeft: '2px' }} />
              </div>
            </div>

            {/* Content Details */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px', flex: 1 }}>
                {item.description}
              </p>

              {/* Tools Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {item.tools.map((t, idx) => (
                  <span key={idx} className="badge badge-gray" style={{ fontSize: '0.7rem' }}>
                    {t}
                  </span>
                ))}
              </div>

              {/* Verification & Action Bar */}
              <div style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-light)'
              }}>
                <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>
                  <ShieldCheck size={12} />
                  <span>{item.evidenceType || 'Verified Workflow'}</span>
                </span>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewItem(item)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 10px' }}
                    title="View Full Details"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 10px', color: '#EF4444' }}
                    title="Delete Entry"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Portfolio Piece Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddModalOpen(false)}
          title="Add AI-Generated Portfolio Piece"
        >
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Velora Eau De Parfum Luxury Botanical Commercial"
                value={formItemData.title}
                onChange={(e) => setFormItemData({ ...formItemData, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formItemData.category}
                  onChange={(e) => setFormItemData({ ...formItemData, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Media Type</label>
                <select
                  className="form-select"
                  value={formItemData.mediaType}
                  onChange={(e) => setFormItemData({ ...formItemData, mediaType: e.target.value })}
                >
                  <option value="Video / Render">AI Video / Motion Render</option>
                  <option value="High-Res Image">8K High-Res Static Render</option>
                  <option value="3D Animation">3D Animation & Spatial</option>
                  <option value="Virtual Model">Virtual Model / Lookbook</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image / Video URL or Preview</label>
              <input
                type="text"
                className="form-input"
                value={formItemData.image}
                onChange={(e) => setFormItemData({ ...formItemData, image: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">AI Tools & Models Used</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Flux.1 Pro, ComfyUI, Runway Gen-3, Magnific AI"
                value={formItemData.tools}
                onChange={(e) => setFormItemData({ ...formItemData, tools: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Creative Techniques (ControlNet, IP-Adapter, LoRA, etc.)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Custom trained LoRA, ControlNet Depth, AnimateDiff"
                value={formItemData.techniques}
                onChange={(e) => setFormItemData({ ...formItemData, techniques: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Generation Workflow & Technical Pipeline</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Describe node architecture, temporal coherence steps, and upscaling passes..."
                value={formItemData.workflowDetails}
                onChange={(e) => setFormItemData({ ...formItemData, workflowDetails: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Commercial-Use Permissions & Buyout Rights</label>
              <input
                type="text"
                className="form-input"
                value={formItemData.commercialRights}
                onChange={(e) => setFormItemData({ ...formItemData, commercialRights: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Generation Prompt & Seed Summary</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="e.g. hyper-realistic luxury perfume bottle surrounded by golden fluid refraction, octane render 8k"
                value={formItemData.promptSummary}
                onChange={(e) => setFormItemData({ ...formItemData, promptSummary: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ backgroundColor: '#7C3AED', borderColor: '#7C3AED' }}
              >
                <PlusCircle size={15} />
                <span>Save to Portfolio</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Portfolio Preview Modal */}
      {selectedPreviewItem && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPreviewItem(null)}
          title={selectedPreviewItem.title}
        >
          <div style={{ padding: '4px 0' }}>
            <div style={{ width: '100%', height: '300px', backgroundColor: '#0F172A', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '18px' }}>
              <img
                src={selectedPreviewItem.image}
                alt={selectedPreviewItem.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Description:
              </div>
              <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '4px' }}>
                {selectedPreviewItem.description}
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '14px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '4px' }}>
                Generation Prompt:
              </div>
              <code style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                "{selectedPreviewItem.promptSummary || 'Studio lighting, 8k render, octane materials, hyper-realistic'}"
              </code>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-verified">
                <ShieldCheck size={14} />
                <span>{selectedPreviewItem.evidenceType || 'Verified Proof'}</span>
              </span>

              <button
                type="button"
                onClick={() => setSelectedPreviewItem(null)}
                className="btn btn-outline"
              >
                Close Preview
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PortfolioManagerPage;
