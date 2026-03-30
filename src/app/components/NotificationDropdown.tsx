import { useState } from 'react';
import { Bell, CheckCheck, Settings, Briefcase, UserPlus, MessageSquare, Info, Users, Star } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { MOCK_NOTIFICATIONS, type Notification } from '@/app/data/notifications';

interface NotificationDropdownProps {
  onNavigate: (page: string, params?: any) => void;
  onClose: () => void;
}

const TYPE_ICON: Record<Notification['type'], React.ReactNode> = {
  application_update: <Briefcase size={16} />,
  connection_request: <UserPlus size={16} />,
  message: <MessageSquare size={16} />,
  system: <Info size={16} />,
  community: <Users size={16} />,
  listing_review: <Star size={16} />,
};

const TYPE_COLOR: Record<Notification['type'], string> = {
  application_update: 'bg-blue-50 text-blue-600',
  connection_request: 'bg-teal-50 text-teal-600',
  message: 'bg-indigo-50 text-indigo-600',
  system: 'bg-amber-50 text-amber-600',
  community: 'bg-purple-50 text-purple-600',
  listing_review: 'bg-emerald-50 text-emerald-600',
};

function timeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function NotificationDropdown({ onNavigate, onClose }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClick = (n: Notification) => {
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, isRead: true } : item));
    if (n.link) {
      onNavigate(n.link.page, n.link.params);
    }
    onClose();
  };

  return (
    <div className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200/60 animate-fade-in origin-top-right overflow-hidden z-50">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <p className="font-bold text-gray-900" style={{ fontSize: 16 }}>Notifications</p>
          {unreadCount > 0 && (
            <span
              className="min-w-[20px] h-[20px] rounded-full bg-red-500 text-white flex items-center justify-center px-1"
              style={{ fontSize: 10, fontWeight: 800 }}
            >
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-brand-primary hover:text-brand-primary/80 transition-colors"
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.map(n => (
          <button
            key={n.id}
            onClick={() => handleClick(n)}
            className={`w-full text-left px-5 py-4 flex gap-3.5 border-b border-gray-50 transition-colors ${
              n.isRead ? 'hover:bg-gray-50/60' : 'bg-blue-50/30 hover:bg-blue-50/50'
            }`}
          >
            {/* Avatar or Icon */}
            <div className="shrink-0 mt-0.5">
              {n.avatarUrl ? (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50">
                  <ImageWithFallback src={n.avatarUrl} alt="" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${TYPE_COLOR[n.type]}`}>
                  {TYPE_ICON[n.type]}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p
                  className={`text-gray-900 leading-snug ${n.isRead ? 'font-medium' : 'font-bold'}`}
                  style={{ fontSize: 13 }}
                >
                  {n.title}
                </p>
                {!n.isRead && (
                  <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0 mt-1.5" />
                )}
              </div>
              <p className="text-gray-500 leading-relaxed line-clamp-2 mt-0.5" style={{ fontSize: 12 }}>
                {n.body}
              </p>
              <p className="text-gray-400 mt-1" style={{ fontSize: 11, fontWeight: 500 }}>
                {timeAgo(n.timestamp)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={() => { onNavigate('NotificationSettings'); onClose(); }}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors w-full justify-center"
          style={{ fontSize: 12, fontWeight: 600 }}
        >
          <Settings size={13} />
          Notification Settings
        </button>
      </div>
    </div>
  );
}
