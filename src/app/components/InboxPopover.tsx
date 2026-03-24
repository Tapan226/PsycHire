import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Send, 
  MessageSquare, ArrowLeft, MoreVertical, X
} from 'lucide-react';
import { MOCK_CONVERSATIONS, Conversation, Message } from '@/app/data/inbox';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

// --- Components ---

// 1. Conversation List Item
const ConversationItem = ({ 
  conversation, 
  isSelected, 
  onClick 
}: { 
  conversation: Conversation; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const otherParticipant = conversation.participants[0];
  const lastMsg = conversation.messages[conversation.messages.length - 1];
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday 
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full p-4 flex gap-3 text-left border-b border-gray-100/50 transition-all ${
        isSelected 
          ? 'bg-brand-primary/5 border-l-4 border-l-brand-primary border-b-transparent' 
          : 'hover:bg-gray-50 border-l-4 border-l-transparent'
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-white overflow-hidden flex items-center justify-center text-gray-500 font-bold border border-gray-100 shadow-sm">
          {otherParticipant.avatarUrl ? (
            <ImageWithFallback src={otherParticipant.avatarUrl} alt={otherParticipant.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm">{otherParticipant.name[0]}</span>
          )}
        </div>
        {conversation.unreadCount > 0 && (
           <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand-primary text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
             {conversation.unreadCount}
           </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-bold text-xs truncate ${conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'}`}>
            {otherParticipant.name}
          </span>
          <span className="text-[9px] text-gray-400 shrink-0">
            {formatTime(lastMsg?.timestamp)}
          </span>
        </div>
        
        <p className={`text-[11px] truncate ${conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
          {lastMsg?.senderId === 'me' ? 'You: ' : ''}{lastMsg?.content}
        </p>
      </div>
    </button>
  );
};

// 2. Message Bubble
const MessageBubble = ({ message, isMe }: { message: Message; isMe: boolean }) => {
  return (
    <div className={`flex flex-col gap-1 max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
       <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap shadow-sm ${
         isMe 
           ? 'bg-brand-primary text-white rounded-br-none' 
           : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
       }`}>
         {message.content}
       </div>
       <span className="text-[9px] text-gray-400 px-1 select-none">
         {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
       </span>
    </div>
  );
};

// --- Main Popover Component ---

interface InboxPopoverProps {
  onClose: () => void;
}

export function InboxPopover({ onClose }: InboxPopoverProps) {
  const [conversations, setConversations] = useState<Conversation[]>(
    MOCK_CONVERSATIONS.filter(c => c.context.type !== 'System')
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = useMemo(() => 
    conversations.find(c => c.id === selectedId) || null
  , [conversations, selectedId]);

  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  // Handlers
  const handleSend = () => {
    if (!inputText.trim() || !selectedId) return;

    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: 'me',
      content: inputText,
      timestamp: new Date().toISOString()
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessageAt: newMessage.timestamp
        };
      }
      return c;
    }));

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="absolute top-14 right-0 w-[400px] h-[550px] bg-white rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden animate-fade-in z-50">
        
        {/* Header */}
        <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 z-10">
           {selectedId ? (
              <div className="flex items-center gap-3 w-full">
                <button 
                  onClick={() => setSelectedId(null)}
                  className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-100 shrink-0">
                       {activeConversation?.participants[0].avatarUrl ? (
                          <ImageWithFallback src={activeConversation.participants[0].avatarUrl} alt="" className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-xs">
                             {activeConversation?.participants[0].name[0]}
                          </div>
                       )}
                    </div>
                    <span className="font-bold text-sm text-gray-900 truncate">{activeConversation?.participants[0].name}</span>
                </div>
              </div>
           ) : (
              <h3 className="font-bold text-lg text-gray-900">Messages</h3>
           )}
           
           {!selectedId && (
              <div className="flex items-center gap-2">
                 <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreVertical size={18} />
                 </button>
                 <button 
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                 >
                    <X size={18} />
                 </button>
              </div>
           )}
           {selectedId && (
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
           )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative bg-gray-50">
           
           {/* List View */}
           <div className={`absolute inset-0 bg-white transition-transform duration-300 ease-in-out flex flex-col ${selectedId ? '-translate-x-full' : 'translate-x-0'}`}>
              <div className="px-4 py-3 border-b border-gray-50">
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                   <input 
                     type="text" 
                     placeholder="Search messages..." 
                     className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-brand-primary/20 rounded-lg text-xs focus:ring-2 focus:ring-brand-primary/5 transition-all outline-none"
                   />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                 {conversations.length > 0 ? (
                   conversations.map(c => (
                     <ConversationItem 
                       key={c.id} 
                       conversation={c} 
                       isSelected={false} 
                       onClick={() => setSelectedId(c.id)}
                     />
                   ))
                 ) : (
                   <div className="flex flex-col items-center justify-center h-48 text-gray-400 gap-2">
                     <MessageSquare size={24} className="opacity-20" />
                     <p className="text-xs">No conversations yet.</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Chat View */}
           <div className={`absolute inset-0 bg-gray-50 transition-transform duration-300 ease-in-out flex flex-col ${selectedId ? 'translate-x-0' : 'translate-x-full'}`}>
              {activeConversation && (
                 <>
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                       <div className="flex justify-center mb-2">
                          <span className="text-[9px] font-bold text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {new Date(activeConversation.messages[0].timestamp).toLocaleDateString()}
                          </span>
                       </div>

                       {activeConversation.messages.map(msg => (
                          <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === 'me'} />
                       ))}
                       <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 bg-white border-t border-gray-200 shrink-0">
                       <div className="flex items-end gap-2 bg-gray-50 p-1.5 rounded-[18px] border border-gray-200 focus-within:border-brand-primary/30 focus-within:ring-2 focus-within:ring-brand-primary/5 transition-all">
                          <textarea
                               value={inputText}
                               onChange={(e) => setInputText(e.target.value)}
                               onKeyDown={handleKeyPress}
                               placeholder="Type a message..."
                               className="flex-1 bg-transparent border-none px-3 py-2 text-xs focus:ring-0 transition-all resize-none max-h-24 min-h-[36px]"
                               rows={1}
                               style={{ height: 'auto', minHeight: '36px' }}
                          />
                          <button 
                             onClick={handleSend}
                             disabled={!inputText.trim()}
                             className="p-2 bg-brand-primary text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                          >
                             <Send size={14} className="ml-0.5" />
                          </button>
                       </div>
                    </div>
                 </>
              )}
           </div>

        </div>
    </div>
  );
}
