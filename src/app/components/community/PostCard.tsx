import React, { useState } from 'react';
import { Post } from '@/app/data/community';
import { MessageSquare, MoreHorizontal, Flag, Share2, BellRing, Mic, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { UserGroupBadge } from '@/app/components/profile/UserGroupBadge';
import type { UserGroup } from '@/app/data/profile';

interface PostCardProps {
  post: Post;
  onReply: (postId: string) => void;
  circleName?: string;
  onClickCircle?: () => void;
}

export function PostCard({ post, onReply, circleName, onClickCircle }: PostCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);

  const isExpert = post.type === 'Expert';
  const isAnnouncement = post.type === 'Announcement';
  const isOpenMic = post.type === 'OpenMic';
  
  const isLongContent = post.content.length > 280;
  const contentToDisplay = isExpanded || !isLongContent ? post.content : post.content.slice(0, 280) + '...';

  const toggleComments = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowComments(!showComments);
  };

  return (
    <div className={`bg-white rounded-xl border flex flex-col shadow-sm transition-all duration-300 relative overflow-hidden
        ${isAnnouncement ? 'border-brand-primary/20 bg-brand-primary/[0.02]' : 'border-gray-100'}
    `}>
      
      {/* Header: Author Info with Light Grey Background */}
      <div className="flex items-center gap-3 px-5 py-3 bg-gray-50/80 border-b border-gray-100">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-white flex-shrink-0">
               {post.author.avatarUrl ? (
                   <ImageWithFallback src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
               ) : (
                   <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                       {post.author.name[0]}
                   </div>
               )}
          </div>
          
          <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                 <span className="text-sm font-semibold text-gray-900">{post.author.name}</span>
                 <UserGroupBadge group={post.author.role as UserGroup} size="sm" />
                 {circleName && (
                     <>
                        <span className="text-gray-300 text-xs">•</span>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onClickCircle?.();
                            }}
                            className="text-sm font-semibold text-gray-500 hover:text-brand-primary hover:underline transition-colors"
                        >
                            {circleName}
                        </button>
                     </>
                 )}
              </div>
              <span className="text-[11px] text-gray-400 font-medium">{post.timestamp}</span>
          </div>

          <div className="relative ml-auto">
             <button 
                 onClick={() => setIsMenuOpen(!isMenuOpen)}
                 className="text-gray-400 hover:text-gray-600 p-1.5 rounded hover:bg-gray-100 transition-colors"
             >
                 <MoreHorizontal size={16} />
             </button>
             {isMenuOpen && (
                 <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-10 py-1">
                     <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                         <Flag size={14} /> Report
                     </button>
                 </div>
             )}
         </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 p-5">
         {/* Title (if exists) */}
         {post.title && (
             <p className="text-[16px] font-bold text-gray-900" style={{ lineHeight: '1.35' }}>
                {isAnnouncement && <span className="inline-block mr-2 text-brand-primary"><BellRing size={16} className="inline" /></span>}
                {isOpenMic && <span className="inline-block mr-2 text-purple-600"><Mic size={16} className="inline" /></span>}
                {post.title}
             </p>
         )}
         
         {/* Body Text */}
         <div className="text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap">
             {contentToDisplay}
         </div>
         
         {isLongContent && (
             <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm font-medium text-brand-primary hover:underline flex items-center gap-1 w-fit mt-1"
             >
                {isExpanded ? (
                    <>Show less <ChevronUp size={14} /></>
                ) : (
                    <>Read more <ChevronDown size={14} /></>
                )}
             </button>
         )}
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="mx-5 rounded-xl overflow-hidden border border-gray-100">
          <img src={post.imageUrl} alt="" className="w-full h-auto max-h-[400px] object-cover" />
        </div>
      )}

      {/* Footer / Actions */}
      <div className="px-5 pb-4 pt-0">
         <div className="flex items-center gap-1 pt-4 border-t border-gray-100">
            <button
                onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); setLikeCount(prev => isLiked ? prev - 1 : prev + 1); }}
                className={`flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-lg transition-colors text-sm font-medium
                    ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:text-red-500 hover:bg-gray-50'}
                `}
            >
                <Heart size={16} className={isLiked ? 'fill-current' : ''} />
                {likeCount > 0 ? likeCount : 'Like'}
            </button>
            <button
                onClick={toggleComments}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium
                    ${showComments ? 'text-brand-primary bg-brand-primary/5' : 'text-gray-500 hover:text-brand-primary hover:bg-gray-50'}
                `}
            >
                <MessageSquare size={16} />
                {post.comments.length > 0 ? `${post.comments.length} Comments` : 'Comment'}
            </button>
         </div>

         {/* Inline Comments Section (Only when toggled) */}
         {showComments && (
              <div className="mt-2 pt-3 border-t border-gray-100 animate-fade-in">
                   {post.comments.length > 0 ? (
                       <div className="flex flex-col gap-3 mb-4">
                           {post.comments.map(comment => (
                               <div key={comment.id} className="flex gap-2.5 items-start">
                                   <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 mt-0.5 border border-gray-200">
                                       {comment.author.avatarUrl ? (
                                           <ImageWithFallback src={comment.author.avatarUrl} alt={comment.author.name} className="w-full h-full object-cover" />
                                       ) : (
                                           <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-[10px]">
                                               {comment.author.name[0]}
                                           </div>
                                       )}
                                   </div>
                                   <div className="flex-1 bg-gray-50 p-2.5 rounded-lg rounded-tl-none">
                                       <div className="flex items-center justify-between gap-2 mb-0.5">
                                           <div className="flex items-center gap-1.5">
                                             <span className="text-xs font-bold text-gray-900">{comment.author.name}</span>
                                             <UserGroupBadge group={comment.author.role as UserGroup} size="sm" />
                                           </div>
                                           <span className="text-[10px] text-gray-400">{comment.timestamp}</span>
                                       </div>
                                       <p className="text-sm text-gray-700 leading-snug">{comment.content}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   ) : (
                       <div className="text-center py-4 text-sm text-gray-500 italic">No comments yet. Be the first to share your thoughts!</div>
                   )}
                   
                   {/* Add Comment Input */}
                   <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden">
                           {/* Placeholder for current user avatar */}
                           <div className="w-full h-full flex items-center justify-center bg-brand-primary text-white font-bold text-xs">
                               ME
                           </div>
                       </div>
                       <div className="flex-1 relative">
                           <input 
                               type="text" 
                               placeholder="Write a comment..." 
                               className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 transition-all"
                           />
                           <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-brand-primary hover:bg-brand-primary/10 rounded-full">
                               <MessageSquare size={14} className="fill-current" />
                           </button>
                       </div>
                   </div>
              </div>
         )}
      </div>

    </div>
  );
}