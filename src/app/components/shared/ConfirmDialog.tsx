/**
 * ConfirmDialog — Reusable confirmation modal using Radix AlertDialog.
 * Used for destructive / irreversible actions (unsave, delete, leave).
 */

import React from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { AlertTriangle, Trash2, LogOut, X } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'neutral';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
  icon?: React.ElementType;
}

const VARIANT_STYLES: Record<ConfirmVariant, {
  iconBg: string;
  iconColor: string;
  btnBg: string;
  btnHover: string;
}> = {
  danger: {
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    btnBg: 'bg-red-600',
    btnHover: 'hover:bg-red-700',
  },
  warning: {
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    btnBg: 'bg-amber-600',
    btnHover: 'hover:bg-amber-700',
  },
  neutral: {
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-500',
    btnBg: 'bg-[#1e40af]',
    btnHover: 'hover:bg-[#1e3a8a]',
  },
};

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  icon,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const styles = VARIANT_STYLES[variant];
  const IconComp = icon || (variant === 'danger' ? Trash2 : variant === 'warning' ? AlertTriangle : LogOut);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[380px] animate-fade-in overflow-hidden"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
        >
          <X size={16} />
        </button>

        {/* Content */}
        <div className="px-6 pt-7 pb-5 flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center mb-5`}>
            <IconComp size={24} className={styles.iconColor} strokeWidth={1.8} />
          </div>

          <p
            id="confirm-title"
            style={{ fontSize: 16, fontWeight: 700, lineHeight: '1.3' }}
            className="text-gray-900 mb-2"
          >
            {title}
          </p>
          <p
            id="confirm-desc"
            style={{ fontSize: 13, lineHeight: '1.6' }}
            className="text-gray-500"
          >
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white ${styles.btnBg} ${styles.btnHover} transition-colors`}
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}