import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { X, Link2, Copy, Check, MessageCircle, Mail, Linkedin, Send, Share2 } from 'lucide-react';
import { toastLinkCopied, toastShared } from '@/app/components/shared/toasts';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  shareUrl?: string;
  onMessageShare?: () => void;
}

const CHANNELS = [
  { id: 'copy', label: 'Copy Link', icon: Link2, color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'bg-green-50 text-green-700 hover:bg-green-100' },
  { id: 'email', label: 'Email', icon: Mail, color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-sky-50 text-sky-700 hover:bg-sky-100' },
  { id: 'message', label: 'In-App Message', icon: Send, color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
] as const;

export function ShareModal({ isOpen, onClose, title, subtitle, shareUrl, onMessageShare }: ShareModalProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const url = shareUrl || `https://psychire.com/share/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`;

  const handleChannelClick = (channelId: string) => {
    switch (channelId) {
      case 'copy':
        navigator.clipboard?.writeText(url).catch(() => {});
        setCopied(true);
        toastLinkCopied();
        setTimeout(() => setCopied(false), 2000);
        break;
      case 'whatsapp':
        toastShared('WhatsApp');
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, '_blank');
        onClose();
        break;
      case 'email':
        toastShared('Email');
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check this out: ${url}`)}`, '_blank');
        onClose();
        break;
      case 'linkedin':
        toastShared('LinkedIn');
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        onClose();
        break;
      case 'message':
        onMessageShare?.();
        onClose();
        break;
    }
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[400px] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Share2 size={18} className="text-brand-primary" />
            </div>
            <div>
              <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Share</p>
              {subtitle && (
                <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{subtitle}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title being shared */}
        <div className="mx-6 mb-4 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-gray-900 line-clamp-2" style={{ fontSize: 13, fontWeight: 600 }}>{title}</p>
        </div>

        {/* Share Channels */}
        <div className="px-6 pb-2 flex flex-col gap-1.5">
          {CHANNELS.map(channel => (
            <button
              key={channel.id}
              onClick={() => handleChannelClick(channel.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${channel.color}`}
            >
              {channel.id === 'copy' && copied ? (
                <Check size={18} className="text-green-600" />
              ) : (
                <channel.icon size={18} />
              )}
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {channel.id === 'copy' && copied ? 'Copied!' : channel.label}
              </span>
            </button>
          ))}
        </div>

        {/* URL Preview */}
        <div className="mx-6 mt-3 mb-6 flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
          <Link2 size={14} className="text-gray-400 shrink-0" />
          <p className="text-gray-500 truncate flex-1" style={{ fontSize: 11 }}>{url}</p>
          <button
            onClick={() => handleChannelClick('copy')}
            className="shrink-0 text-brand-primary hover:text-brand-primary/80 transition-colors"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}