import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { X, ChevronDown, Check, ImagePlus } from 'lucide-react';
import { CommunityCircle, PostType, UserProfile } from '@/app/data/community';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { type: PostType; title: string; content: string; circleId: string; imageUrl?: string }) => void;
  joinedCircles?: CommunityCircle[];
  currentUser?: UserProfile;
  circleName?: string;
}

export function CreatePostModal({
    isOpen,
    onClose,
    onSubmit,
    joinedCircles = [],
    currentUser,
    circleName,
}: CreatePostModalProps) {
  const [selectedCircleId, setSelectedCircleId] = useState<string>(joinedCircles?.[0]?.id || '');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (joinedCircles?.length > 0 && (!selectedCircleId || !joinedCircles.find(c => c.id === selectedCircleId))) {
        setSelectedCircleId(joinedCircles[0].id);
    }
  }, [joinedCircles, selectedCircleId]);

  if (!isOpen || !mounted) return null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = () => {
    if (!content.trim() || !selectedCircleId) return;
    onSubmit({
        type: 'Text',
        title: title,
        content: content,
        circleId: selectedCircleId,
        imageUrl: imagePreview || undefined,
    });
    setTitle('');
    setContent('');
    setImagePreview(null);
    onClose();
  };

  const selectedCircle = joinedCircles?.find(c => c.id === selectedCircleId);

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-50 animate-fade-in">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <p className="text-[18px] font-bold text-gray-900">Create Post</p>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
            </button>
        </div>
        <div className="p-6 overflow-y-auto">
            <div className="flex flex-col gap-4">
                <div className="relative">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Post to Circle</label>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                        <span className={selectedCircle ? 'text-gray-900' : 'text-gray-400'}>
                            {selectedCircle ? selectedCircle.name : 'Select a circle'}
                        </span>
                        <ChevronDown size={16} className="text-gray-500" />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-20">
                            {joinedCircles?.length > 0 ? joinedCircles.map(circle => (
                                <button
                                    key={circle.id}
                                    onClick={() => { setSelectedCircleId(circle.id); setIsDropdownOpen(false); }}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 flex items-center justify-between"
                                >
                                    {circle.name}
                                    {selectedCircleId === circle.id && <Check size={16} className="text-[color:var(--color-brand-primary)]" />}
                                </button>
                            )) : (
                                <div className="px-4 py-3 text-sm text-gray-400">No circles available</div>
                            )}
                        </div>
                    )}
                </div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your post a clear title..."
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[color:var(--color-brand-primary)] transition-colors"
                    />
                </div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[color:var(--color-brand-primary)] transition-colors min-h-[150px] resize-none"
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Image <span className="font-normal normal-case tracking-normal text-gray-400">(Optional)</span></label>
                    {imagePreview ? (
                      <div className="relative rounded-xl overflow-hidden border border-gray-200">
                        <img src={imagePreview} alt="Preview" className="w-full max-h-[200px] object-cover" />
                        <button
                          onClick={() => setImagePreview(null)}
                          className="absolute top-2 right-2 w-7 h-7 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center gap-3 p-4 bg-gray-50 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-100 hover:border-gray-400 transition-all">
                        <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                          <ImagePlus size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Add an image</p>
                          <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                </div>
            </div>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end">
            <button
                onClick={handleSubmit}
                disabled={!content.trim() || !selectedCircleId}
                className="bg-[color:var(--color-brand-primary)] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
                Post
            </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}