import React from 'react';
import type { UserGroup } from '@/app/data/profile';

interface UserGroupBadgeProps {
  group: UserGroup;
  size?: 'sm' | 'md';
}

const groupConfig: Record<UserGroup, { bg: string; text: string }> = {
  Student: { bg: 'bg-blue-50', text: 'text-blue-600' },
  Professional: { bg: 'bg-teal-50', text: 'text-teal-600' },
  Expert: { bg: 'bg-purple-50', text: 'text-purple-600' },
  Company: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  Admin: { bg: 'bg-gray-100', text: 'text-gray-600' },
};

export function UserGroupBadge({ group, size = 'md' }: UserGroupBadgeProps) {
  const config = groupConfig[group];
  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-1.5 py-px'
    : 'text-[11px] px-2 py-0.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${config.bg} ${config.text} ${sizeClasses}`}
    >
      {group}
    </span>
  );
}
