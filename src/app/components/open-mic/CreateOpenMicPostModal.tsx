import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { X, Plus, Type, Image, Video, Headphones, Link2 } from 'lucide-react';
import { OPEN_MIC_CATEGORIES, WORD_LIMIT, type OpenMicCategory, type PostFormat } from '@/app/data/open-mic';

interface CreateOpenMicPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: OpenMicCategory;
    title: string;
    content: string;
    format: PostFormat;
    tags: string[];
    linkUrl?: string;
  }) => void;
}

const FORMAT_OPTIONS: { key: PostFormat; label: string; icon: React.ReactNode }[] = [
  { key: 'text', label: 'Text', icon: <Type size={15} /> },
  { key: 'image', label: 'Image', icon: <Image size={15} /> },
  { key: 'video', label: 'Video', icon: <Video size={15} /> },
  { key: 'audio', label: 'Audio', icon: <Headphones size={15} /> },
  { key: 'link', label: 'Link', icon: <Link2 size={15} /> },
];

export function CreateOpenMicPostModal({ isOpen, onClose, onSubmit }: CreateOpenMicPostModalProps) {
  const [category, setCategory] = useState<OpenMicCategory | ''>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [format, setFormat] = useState<PostFormat>('text');
  const [linkUrl, setLinkUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const isOverLimit = wordCount > WORD_LIMIT;
  const canSubmit = !!category && title.trim().length > 0 && content.trim().length > 0 && !isOverLimit;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && tags.length < 5 && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleSubmit = () => {
    if (!canSubmit || !category) return;
    onSubmit({
      category: category as OpenMicCategory,
      title: title.trim(),
      content: content.trim(),
      format,
      tags,
      linkUrl: format === 'link' ? linkUrl.trim() : undefined,
    });
    // Reset
    setCategory('');
    setTitle('');
    setContent('');
    setFormat('text');
    setLinkUrl('');
    setTags([]);
    onClose();
  };

  const inputClass = 'w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all';
  const labelClass = 'text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block';

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-50 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Create Post</p>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          {/* Category selection */}
          <div>
            <label className={labelClass}>Category <span className="text-red-400">*</span></label>
            <div className="flex flex-wrap gap-1.5">
              {OPEN_MIC_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                    category === cat
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>Title <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Give your post a clear title..."
              className={inputClass}
              maxLength={120}
            />
            <p className="text-[11px] text-gray-400 mt-1 text-right">{title.length}/120</p>
          </div>

          {/* Format */}
          <div>
            <label className={labelClass}>Format</label>
            <div className="flex gap-2">
              {FORMAT_OPTIONS.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFormat(f.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium border transition-all ${
                    format === f.key
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Link URL (only for link format) */}
          {format === 'link' && (
            <div>
              <label className={labelClass}>Link URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={e => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
          )}

          {/* Media note for non-text formats */}
          {(format === 'image' || format === 'video' || format === 'audio') && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-[12px] text-gray-500">
              Media upload will be available after posting. You can add {format} content to your post once it&apos;s created.
            </div>
          )}

          {/* Content */}
          <div>
            <label className={labelClass}>Content <span className="text-red-400">*</span></label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Share your reflection, insight, or experience..."
              className={`${inputClass} min-h-[160px] resize-none`}
            />
            <div className="flex items-center justify-between mt-1">
              <p className={`text-[11px] ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
                {wordCount.toLocaleString()} / {WORD_LIMIT.toLocaleString()} words
              </p>
              {isOverLimit && (
                <p className="text-[11px] text-red-500 font-medium">Over word limit</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags <span className="text-gray-400 font-normal normal-case">(optional, up to 5)</span></label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Type a tag and press Enter"
                className={`flex-1 ${inputClass}`}
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
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-[12px] font-medium">
                    #{tag}
                    <button onClick={() => setTags(tags.filter(t => t !== tag))} className="text-gray-400 hover:text-gray-600">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-gray-400" style={{ fontSize: 11 }}>Posts are visible to all community members.</p>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Publish
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