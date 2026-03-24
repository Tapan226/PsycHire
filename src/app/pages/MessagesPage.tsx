import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, ArrowLeft, MessageSquare, X } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Portal } from '@/app/components/shared/Portal';
import {
  MOCK_CHAT_CONVERSATIONS,
  type ChatConversation,
  type ChatMessage,
} from '@/app/data/messaging';

interface MessagesModalProps {
  onNavigate: (page: string, params?: any) => void;
  onClose: () => void;
  initialConversationPersonId?: string | null;
}

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Now';
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function clockTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MessagesPage({ onNavigate, onClose, initialConversationPersonId }: MessagesModalProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CHAT_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Lock body scroll & handle Escape key
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (initialConversationPersonId) {
      const conv = conversations.find(c => c.person.id === initialConversationPersonId);
      if (conv) {
        setActiveId(conv.id);
        setMobileShowChat(true);
      }
    }
  }, [initialConversationPersonId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, conversations]);

  const activeConv = useMemo(
    () => conversations.find(c => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const handleSend = () => {
    if (!inputText.trim() || !activeId) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };
    setConversations(prev =>
      prev.map(c =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], lastMessageAt: newMsg.timestamp, unreadCount: 0 }
          : c
      )
    );
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectConversation = (id: string) => {
    setActiveId(id);
    setMobileShowChat(true);
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Panel */}
      <div className="relative w-full max-w-5xl mx-4 h-[82vh] min-h-[480px] animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all"
        >
          <X size={16} />
        </button>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl flex h-full overflow-hidden">

          {/* ── Conversation List ── */}
          <div
            className={`w-full md:w-[320px] border-r border-gray-100 flex flex-col shrink-0 ${
              mobileShowChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-[18px] font-extrabold text-gray-900">Messages</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map(conv => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                const isActive = conv.id === activeId;
                const isUnread = conv.unreadCount > 0;

                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`w-full flex items-center gap-3.5 px-6 py-4 text-left transition-colors ${
                      isActive ? 'bg-blue-50/50' : 'hover:bg-gray-50/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={conv.person.avatarUrl}
                          alt={conv.person.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isUnread && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-brand-primary rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[13px] truncate ${isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {conv.person.name}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0">{timeLabel(conv.lastMessageAt)}</span>
                      </div>
                      <p className={`text-[12px] truncate mt-1 ${isUnread ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                        {lastMsg.senderId === 'me' ? 'You: ' : ''}{lastMsg.text}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Chat Panel ── */}
          <div
            className={`flex-1 flex flex-col min-w-0 ${
              !mobileShowChat ? 'hidden md:flex' : 'flex'
            }`}
          >
            {activeConv ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-3.5 px-6 py-4 border-b border-gray-100 shrink-0">
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1 -ml-1 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
                    onClick={() => onNavigate('PersonProfile', { personId: activeConv.person.id })}
                  >
                    <ImageWithFallback
                      src={activeConv.person.avatarUrl}
                      alt={activeConv.person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="text-[14px] font-bold text-gray-900 cursor-pointer hover:text-brand-primary transition-colors"
                    onClick={() => onNavigate('PersonProfile', { personId: activeConv.person.id })}
                  >
                    {activeConv.person.name}
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 bg-gray-50/30">
                  {activeConv.messages.map(msg => {
                    const isMe = msg.senderId === 'me';
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[65%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                        <div
                          className={`px-4 py-2.5 text-[13px] leading-relaxed ${
                            isMe
                              ? 'bg-brand-primary text-white rounded-2xl rounded-br-sm'
                              : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1.5 px-1">{clockTime(msg.timestamp)}</span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t border-gray-100 shrink-0">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-full text-[13px] outline-none focus:border-brand-primary/40 transition-colors"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputText.trim()}
                      className="w-10 h-10 flex items-center justify-center bg-brand-primary text-white rounded-full hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    >
                      <Send size={15} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
                <MessageSquare size={28} className="opacity-20" />
                <p className="text-[14px] text-gray-400">Select a conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </Portal>
  );
}