import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Paperclip,
  Image,
  Sparkles,
  CheckCircle2,
  FolderKanban,
  Search,
  FileText
} from 'lucide-react';

export const CreatorMessagesPage = () => {
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    sendMessage,
    navigateTo
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeConversation =
    conversations.find((c) => c.id === selectedConversationId) || conversations[0];

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    sendMessage(activeConversation.id, messageText.trim());
    setMessageText('');
  };

  const handleSendMilestonePreview = () => {
    sendMessage(activeConversation.id, 'Here is the preliminary fluid dynamics styleframe render from our ComfyUI pipeline!', {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      caption: 'Fluid Refraction Milestone Preview'
    });
  };

  return (
    <div className="page-content animate-fade-in" style={{ padding: '24px 32px', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* Two-Panel Messenger */}
      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', display: 'flex', height: '100%' }}>
        {/* Left Panel: Conversations List */}
        <div style={{
          width: '340px',
          borderRight: '1px solid var(--soft-border)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--warm-ivory-light)',
          flexShrink: 0
        }}>
          {/* Header */}
          <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--soft-border)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '10px' }}>
              Client Conversations
            </h2>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="var(--muted-gray)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '32px', padding: '7px 10px 7px 32px', fontSize: '0.82rem' }}
                placeholder="Search brands or briefs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConversation.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid var(--soft-border)',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--white)' : 'transparent',
                    borderLeft: isSelected ? '4px solid var(--electric-teal)' : '4px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <img
                      src={conv.brandLogo}
                      alt={conv.brandName}
                      style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--ink-black)' }}>
                          {conv.brandName}
                        </strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--muted-gray)' }}>
                          {conv.lastTimestamp}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--electric-teal)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.campaignTitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--muted-gray)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {conv.lastMessage}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Chat Thread */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
          {/* Header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--soft-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={activeConversation.brandLogo}
                alt={activeConversation.brandName}
                style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                  {activeConversation.brandName}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted-gray)' }}>
                  Campaign: <strong>{activeConversation.campaignTitle}</strong>
                </div>
              </div>
            </div>

            {activeConversation.projectId && (
              <button
                onClick={() => navigateTo('creator-projects', { projectId: activeConversation.projectId })}
                className="btn btn-outline btn-sm"
              >
                <FolderKanban size={14} />
                <span>Upload Deliverable Pack</span>
              </button>
            )}
          </div>

          {/* Messages Feed */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--warm-ivory)' }}>
            {activeConversation.messages.map((msg) => {
              const isMe = msg.senderRole === 'creator';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    alignSelf: isMe ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted-gray)', marginBottom: '4px', padding: '0 4px' }}>
                    {msg.senderName} • {msg.timestamp}
                  </div>

                  <div
                    style={{
                      background: isMe ? 'var(--ink-black)' : 'var(--white)',
                      color: isMe ? 'var(--white)' : 'var(--ink-black)',
                      padding: '12px 18px',
                      borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      boxShadow: 'var(--shadow-sm)',
                      border: isMe ? 'none' : '1px solid var(--soft-border)'
                    }}
                  >
                    {msg.text}

                    {msg.attachment && (
                      <div style={{ marginTop: '10px' }}>
                        {msg.attachment.type === 'image' && (
                          <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginTop: '6px' }}>
                            <img src={msg.attachment.url} alt="Attachment" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                            {msg.attachment.caption && (
                              <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.8 }}>
                                {msg.attachment.caption}
                              </div>
                            )}
                          </div>
                        )}
                        {msg.attachment.type === 'file' && (
                          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={16} color="var(--electric-teal)" />
                            <span>{msg.attachment.name} ({msg.attachment.size})</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Creator Action */}
          <div style={{ padding: '8px 24px', background: 'var(--warm-ivory-light)', borderTop: '1px solid var(--soft-border)' }}>
            <button
              type="button"
              onClick={handleSendMilestonePreview}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', color: 'var(--muted-gray)' }}
            >
              <Image size={14} color="var(--electric-teal)" />
              <span>Share Render Preview in Chat</span>
            </button>
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--soft-border)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder="Send message or prompt parameter update to client..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!messageText.trim()}
            >
              <Send size={16} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
