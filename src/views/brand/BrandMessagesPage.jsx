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
  Briefcase,
  ExternalLink,
  Search,
  Smile,
  FileText
} from 'lucide-react';

export const BrandMessagesPage = () => {
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    sendMessage,
    navigateTo
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeConversation =
    conversations.find((c) => c.id === selectedConversationId) || conversations[0];

  const filteredConversations = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    sendMessage(activeConversation.id, messageInput.trim());
    setMessageInput('');
  };

  const handleSendQuickAttachment = (type) => {
    if (type === 'file') {
      sendMessage(activeConversation.id, 'Attached latest brand brief guidelines and vector logo package.', {
        type: 'file',
        name: 'Brand_Guidelines_and_Logos.pdf',
        size: '14.2 MB'
      });
    } else if (type === 'offer') {
      sendMessage(activeConversation.id, 'Deposit confirmed into CreatorProof Escrow for Milestone 2.', {
        type: 'offer',
        title: 'Milestone 2 Escrow Deposit',
        amount: '$1,500 USD',
        status: 'Escrow Funded'
      });
    }
  };

  return (
    <div className="page-content animate-fade-in" style={{ padding: '24px 32px', height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      {/* Two-Panel Messaging Container */}
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
          {/* Search Header */}
          <div style={{ padding: '18px 16px', borderBottom: '1px solid var(--soft-border)' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '10px' }}>
              Messages & Chats
            </h2>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="var(--muted-gray)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '32px', padding: '7px 10px 7px 32px', fontSize: '0.82rem' }}
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Conversation Items */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConversations.map((conv) => {
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={conv.participantAvatar}
                        alt={conv.participantName}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      {conv.online && (
                        <span style={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#059669',
                          border: '2px solid var(--white)'
                        }} />
                      )}
                    </div>

                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.92rem', color: 'var(--ink-black)' }}>
                          {conv.participantName}
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

                  <div style={{
                    fontSize: '0.8rem',
                    color: conv.unreadCount > 0 ? 'var(--ink-black)' : 'var(--muted-gray)',
                    fontWeight: conv.unreadCount > 0 ? 700 : 400,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {conv.lastMessage}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Active Chat Thread */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
          {/* Thread Header */}
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--soft-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={activeConversation.participantAvatar}
                alt={activeConversation.participantName}
                style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                  {activeConversation.participantName}
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--muted-gray)' }}>
                  {activeConversation.participantRole} • Campaign: <strong>{activeConversation.campaignTitle}</strong>
                </div>
              </div>
            </div>

            {/* Direct Link to Project */}
            {activeConversation.projectId && (
              <button
                onClick={() => navigateTo('brand-projects', { projectId: activeConversation.projectId })}
                className="btn btn-outline btn-sm"
              >
                <FolderKanban size={14} />
                <span>View Linked Project & Files</span>
              </button>
            )}
          </div>

          {/* Messages History List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--warm-ivory)' }}>
            {activeConversation.messages.map((msg) => {
              const isMe = msg.senderRole === 'brand';

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

                    {/* Attachment Render */}
                    {msg.attachment && (
                      <div style={{ marginTop: '10px' }}>
                        {msg.attachment.type === 'file' && (
                          <div style={{
                            background: isMe ? 'rgba(255,255,255,0.1)' : 'var(--warm-ivory-light)',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.82rem'
                          }}>
                            <FileText size={20} color="var(--electric-teal)" />
                            <div>
                              <div style={{ fontWeight: 700 }}>{msg.attachment.name}</div>
                              <div style={{ fontSize: '0.72rem', opacity: 0.8 }}>{msg.attachment.size}</div>
                            </div>
                          </div>
                        )}

                        {msg.attachment.type === 'image' && (
                          <div style={{ borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginTop: '6px' }}>
                            <img src={msg.attachment.url} alt="Attachment" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover' }} />
                            {msg.attachment.caption && (
                              <div style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.8 }}>
                                {msg.attachment.caption}
                              </div>
                            )}
                          </div>
                        )}

                        {msg.attachment.type === 'offer' && (
                          <div style={{
                            background: isMe ? 'rgba(0, 214, 201, 0.15)' : '#ECFDF5',
                            border: '1px solid var(--electric-teal)',
                            padding: '12px 16px',
                            borderRadius: 'var(--radius-md)',
                            color: isMe ? 'var(--white)' : '#065F46'
                          }}>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{msg.attachment.title}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, margin: '4px 0' }}>{msg.attachment.amount}</div>
                            <span style={{ fontSize: '0.72rem', background: 'var(--electric-teal)', color: 'var(--ink-black)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                              {msg.attachment.status}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Attachment Triggers Bar */}
          <div style={{ padding: '8px 24px', background: 'var(--warm-ivory-light)', borderTop: '1px solid var(--soft-border)', display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleSendQuickAttachment('file')}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', color: 'var(--muted-gray)' }}
            >
              <Paperclip size={14} />
              <span>Share Guidelines PDF</span>
            </button>
            <button
              type="button"
              onClick={() => handleSendQuickAttachment('offer')}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', color: 'var(--muted-gray)' }}
            >
              <Sparkles size={14} color="var(--electric-teal)" />
              <span>Send Escrow Status Card</span>
            </button>
          </div>

          {/* Composer Box */}
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
              placeholder="Type your message, prompt feedback, or file revision notes..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!messageInput.trim()}
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
