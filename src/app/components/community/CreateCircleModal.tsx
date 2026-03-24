import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { X, Plus, Image, Trash2 } from 'lucide-react';

interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCircleData) => void;
}

export interface CreateCircleData {
  title: string;
  description: string;
  category: string;
  tags: string[];
  moderators: string[];
}

const CATEGORY_OPTIONS = [
  'Clinical',
  'Developmental',
  'Neuropsychology',
  'I/O Psychology',
  'Counselling',
  'Research',
  'Ethics',
  'Wellness',
];

export function CreateCircleModal({ isOpen, onClose, onSubmit }: CreateCircleModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [moderators, setModerators] = useState<string[]>(['']);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && tags.length < 5 && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleModeratorChange = (index: number, value: string) => {
    const updated = [...moderators];
    updated[index] = value;
    setModerators(updated);
  };

  const handleAddModerator = () => {
    if (moderators.length < 3) {
      setModerators([...moderators, '']);
    }
  };

  const handleRemoveModerator = (index: number) => {
    setModerators(moderators.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !category) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category,
      tags,
      moderators: moderators.filter(m => m.trim()),
    });
    setTitle('');
    setDescription('');
    setCategory('');
    setTags([]);
    setModerators(['']);
    onClose();
  };

  const canSubmit = title.trim() && description.trim() && category;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-50 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <p className="text-[18px] font-bold text-gray-900">Form a Circle</p>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Circle Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Clinical Psychology Network"
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[color:var(--color-brand-primary)] focus:ring-1 focus:ring-[color:var(--color-brand-primary)]/20 transition-all"
            />
          </div>

          {/* Banner (placeholder) */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Banner Image
            </label>
            <div className="w-full h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors cursor-pointer">
              <Image size={24} />
              <span className="text-[12px] font-medium">Click to upload banner</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose and focus of this circle..."
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[color:var(--color-brand-primary)] focus:ring-1 focus:ring-[color:var(--color-brand-primary)]/20 transition-all min-h-[100px] resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Category <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                    category === cat
                      ? 'bg-[color:var(--color-brand-primary)] text-white border-[color:var(--color-brand-primary)]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Tags <span className="text-gray-400 font-normal normal-case">(up to 5)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Type a tag and press Enter"
                className="flex-1 p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[color:var(--color-brand-primary)] transition-all"
              />
              <button
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                className="px-3 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-[12px] font-medium"
                  >
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="text-gray-400 hover:text-gray-600">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Moderators */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Moderators <span className="text-gray-400 font-normal normal-case">(up to 3)</span>
            </label>
            <div className="flex flex-col gap-2">
              {moderators.map((mod, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={mod}
                    onChange={(e) => handleModeratorChange(i, e.target.value)}
                    placeholder={`Moderator ${i + 1} name or email`}
                    className="flex-1 p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[color:var(--color-brand-primary)] transition-all"
                  />
                  {moderators.length > 1 && (
                    <button
                      onClick={() => handleRemoveModerator(i)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
              {moderators.length < 3 && (
                <button
                  onClick={handleAddModerator}
                  className="text-[12px] font-medium text-[color:var(--color-brand-primary)] hover:underline flex items-center gap-1 w-fit"
                >
                  <Plus size={12} /> Add another moderator
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-[11px] text-gray-400 font-medium">
            Circles require admin approval before publishing.
          </p>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-[color:var(--color-brand-primary)] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Portal>
    {modalContent}
    </Portal>
  );
}