import React, { useState } from 'react';
import {
  ChevronLeft, MessageSquare, Target, Calendar, Users as UsersIcon,
  Send, Bookmark, ExternalLink, Info,
  Edit3, ShieldCheck, Clock,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { MOCK_PODS, CHECK_IN_PROMPTS, POD_TYPE_COLOR, type PodGoal, type CheckInPost, type PodSession, type PeerPod } from '@/app/data/peer-pods';

type InsideTab = 'overview' | 'members' | 'check-in' | 'goals' | 'sessions';

interface InsidePodPageProps {
  podId: string;
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
}

const TAB_CONFIG: { key: InsideTab; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: 'Overview', icon: <Info size={15} /> },
  { key: 'members', label: 'Members', icon: <UsersIcon size={15} /> },
  { key: 'check-in', label: 'Check-In', icon: <MessageSquare size={15} /> },
  { key: 'goals', label: 'Goals', icon: <Target size={15} /> },
  { key: 'sessions', label: 'Sessions', icon: <Calendar size={15} /> },
];

export function InsidePodPage({ podId, onBack, onNavigate, userRole }: InsidePodPageProps) {
  const pod = MOCK_PODS.find(p => p.id === podId);
  const [activeTab, setActiveTab] = useState<InsideTab>('overview');

  if (!pod) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p style={{ fontSize: 20 }} className="text-gray-900">Pod not found</p>
        <button onClick={onBack} className="mt-4 text-teal-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-in fade-in duration-500">

      {/* ═══ HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-[#0f766e] via-[#115e59] to-[#134e4a] pt-5 pb-0 shadow-sm relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col gap-5">
          {/* Nav bar */}
          <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1.5 text-teal-200/70 hover:text-white transition-colors text-[13px] group">
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Peer Pods
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/60">
                <ShieldCheck size={12} /> Confidential
              </span>
              <div className="flex -space-x-2 ml-2">
                {pod.members.slice(0, 4).map(m => (
                  <div key={m.id} className="w-7 h-7 rounded-full overflow-hidden border-2 border-[#115e59] bg-gray-100">
                    <ImageWithFallback src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                {pod.members.length > 4 && (
                  <div className="w-7 h-7 rounded-full bg-white/15 border-2 border-[#115e59] flex items-center justify-center text-[9px] font-bold text-white">
                    +{pod.members.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: '1.25' }} className="text-white tracking-tight">{pod.title}</p>
            <p style={{ fontSize: 13, fontWeight: 500 }} className="text-teal-200/70 mt-1">{pod.podType} · {pod.duration} · {pod.memberCount} members</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 overflow-x-auto no-scrollbar -mb-px">
            {TAB_CONFIG.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-3.5 text-sm font-bold whitespace-nowrap border-b-[3px] transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-white text-white'
                    : 'border-transparent text-teal-200/60 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-5xl mx-auto px-6 w-full py-8 pb-20">
        {activeTab === 'overview' && <OverviewTab pod={pod} />}
        {activeTab === 'members' && <MembersTab pod={pod} onNavigate={onNavigate} />}
        {activeTab === 'check-in' && <CheckInTab pod={pod} />}
        {activeTab === 'goals' && <GoalsTab pod={pod} />}
        {activeTab === 'sessions' && <SessionsTab pod={pod} />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   OVERVIEW TAB
   ═══════════════════════════════════════ */
function OverviewTab({ pod }: { pod: PeerPod }) {
  const typeColor = POD_TYPE_COLOR[pod.podType];

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* About */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <p style={{ fontSize: 16 }} className="text-gray-900 mb-3">About this Pod</p>
        <p style={{ fontSize: 15, lineHeight: '1.7' }} className="text-gray-600 whitespace-pre-line">{pod.description}</p>
      </div>

      {/* Key Details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <p style={{ fontSize: 16 }} className="text-gray-900 mb-4">Details</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { icon: <span className={`w-8 h-8 rounded-lg ${typeColor.bg} flex items-center justify-center`}><span style={{ fontSize: 12 }} className={`font-bold ${typeColor.text}`}>{pod.podType[0]}</span></span>, label: 'Pod Type', value: pod.podType },
            { icon: <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Clock size={14} className="text-gray-500" /></div>, label: 'Duration', value: pod.duration },
            { icon: <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><UsersIcon size={14} className="text-gray-500" /></div>, label: 'Members', value: `${pod.memberCount}/${pod.maxMembers}` },
            { icon: <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Target size={14} className="text-gray-500" /></div>, label: 'Goal', value: pod.primaryGoal },
            { icon: <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><Calendar size={14} className="text-gray-500" /></div>, label: 'Availability', value: pod.availability },
            { icon: <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center"><ShieldCheck size={14} className="text-teal-600" /></div>, label: 'Privacy', value: 'Confidential' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-lg">
              {item.icon}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">{item.label}</span>
                <span style={{ fontSize: 13 }} className="text-gray-800 font-medium">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Session Preview */}
      {pod.sessions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p style={{ fontSize: 16 }} className="text-gray-900 mb-3">Next Session</p>
          <div className="bg-teal-50/50 border border-teal-100 rounded-lg p-4">
            <p style={{ fontSize: 15 }} className="text-gray-900 mb-1">{pod.sessions[0].title}</p>
            <div className="flex items-center gap-3 text-[13px] text-gray-500">
              <span>{pod.sessions[0].date}</span>
              <span className="text-gray-300">·</span>
              <span>{pod.sessions[0].time}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   MEMBERS TAB
   ═══════════════════════════════════════ */
function MembersTab({ pod, onNavigate }: { pod: PeerPod; onNavigate?: (page: string, params?: any) => void }) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl">
      <p style={{ fontSize: 14 }} className="text-gray-500 mb-2">
        {pod.members.length} member{pod.members.length !== 1 ? 's' : ''} in this pod
      </p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {pod.members.map((member, i) => (
          <button
            key={member.id}
            onClick={() => onNavigate?.('PersonProfile', { personId: member.id })}
            className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left w-full group ${
              i < pod.members.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
              <ImageWithFallback src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize: 15 }} className="text-gray-900 group-hover:text-teal-600 transition-colors truncate">
                {member.name}
              </p>
              <p style={{ fontSize: 12 }} className="text-gray-500 truncate">{member.specialization} · {member.careerStage}</p>
            </div>
            {member.role === 'Creator' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                Creator
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   CHECK-IN TAB
   ═══════════════════════════════════════ */
function CheckInTab({ pod }: { pod: PeerPod }) {
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<CheckInPost[]>(pod.checkIns);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const currentPrompt = CHECK_IN_PROMPTS[Math.floor(Date.now() / 604800000) % CHECK_IN_PROMPTS.length];

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: CheckInPost = {
      id: `ci-new-${Date.now()}`,
      authorId: 'me',
      authorName: 'You',
      authorAvatar: '',
      content: newPost.trim(),
      timestamp: 'Just now',
      comments: [],
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    setPosts(posts.map(p =>
      p.id === postId
        ? { ...p, comments: [...p.comments, { id: `cc-${Date.now()}`, authorName: 'You', authorAvatar: '', content: text, timestamp: 'Just now' }] }
        : p
    ));
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Weekly prompt */}
      <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-5">
        <p style={{ fontSize: 11 }} className="text-teal-600 font-bold uppercase tracking-wider mb-2">Weekly Guided Prompt</p>
        <p style={{ fontSize: 15 }} className="text-teal-800 italic">&ldquo;{currentPrompt}&rdquo;</p>
      </div>

      {/* New post */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Share your weekly check-in..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all min-h-[100px] resize-none"
        />
        <div className="flex items-center justify-end mt-3 gap-2">
          <button
            onClick={handlePost}
            disabled={!newPost.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-bold text-sm rounded-xl hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <Send size={14} /> Post
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Post header */}
          <div className="flex items-center gap-3 px-5 py-3 bg-gray-50/80 border-b border-gray-100">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
              {post.authorAvatar ? (
                <ImageWithFallback src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-700 font-bold text-[11px]">
                  {post.authorName[0]}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">{post.authorName}</span>
              <span className="text-[11px] text-gray-400 font-medium">{post.timestamp}</span>
            </div>
          </div>

          {/* Post content */}
          <div className="px-5 py-4">
            <p style={{ fontSize: 15, lineHeight: '1.7' }} className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Actions */}
          <div className="px-5 pb-4">
            <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => setExpandedComments({ ...expandedComments, [post.id]: !expandedComments[post.id] })}
                className={`flex items-center gap-2 px-3 py-1.5 -ml-3 rounded-lg transition-colors text-sm font-medium ${
                  expandedComments[post.id] ? 'text-teal-600 bg-teal-50' : 'text-gray-500 hover:text-teal-600 hover:bg-gray-50'
                }`}
              >
                <MessageSquare size={15} />
                {post.comments.length > 0 ? `${post.comments.length} Comment${post.comments.length > 1 ? 's' : ''}` : 'Comment'}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-teal-600 hover:bg-gray-50 transition-colors">
                <Bookmark size={15} /> Save
              </button>
            </div>

            {/* Comments */}
            {expandedComments[post.id] && (
              <div className="mt-3 pt-3 border-t border-gray-100 animate-fade-in">
                {post.comments.length > 0 && (
                  <div className="flex flex-col gap-3 mb-4">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex gap-2.5 items-start">
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 shrink-0 mt-0.5 border border-gray-200">
                          {comment.authorAvatar ? (
                            <ImageWithFallback src={comment.authorAvatar} alt={comment.authorName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-[10px]">
                              {comment.authorName[0]}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 bg-gray-50 p-2.5 rounded-lg rounded-tl-none">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="text-xs font-bold text-gray-900">{comment.authorName}</span>
                            <span className="text-[10px] text-gray-400">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment input */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-teal-100 shrink-0 flex items-center justify-center text-[10px] font-bold text-teal-700">
                    ME
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={e => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                      placeholder="Write a comment..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all"
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-teal-600 hover:bg-teal-50 rounded-full"
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <MessageSquare size={22} className="text-gray-400" />
          </div>
          <p style={{ fontSize: 15 }} className="text-gray-700">No check-ins yet</p>
          <p style={{ fontSize: 13 }} className="text-gray-500">Be the first to share your weekly check-in with the pod.</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   GOALS TAB
   ═══════════════════════════════════════ */
function GoalsTab({ pod }: { pod: PeerPod }) {
  const [goals, setGoals] = useState<PodGoal[]>(pod.goals);
  const [isEditing, setIsEditing] = useState(false);
  const [editGoal, setEditGoal] = useState({ professionalGoal: '', wellbeingGoal: '', weeklyCommitment: '' });

  const myGoal = goals.find(g => g.memberId === 'me');

  const handleSave = () => {
    if (myGoal) {
      setGoals(goals.map(g => g.memberId === 'me' ? { ...g, ...editGoal } : g));
    } else {
      setGoals([...goals, {
        id: `g-new-${Date.now()}`,
        memberId: 'me',
        memberName: 'You',
        memberAvatar: '',
        ...editGoal,
      }]);
    }
    setIsEditing(false);
  };

  const inputClass = 'w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all';

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* My Goal */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <p style={{ fontSize: 15 }} className="text-gray-900">My Goals</p>
          {!isEditing && (
            <button
              onClick={() => {
                setEditGoal({
                  professionalGoal: myGoal?.professionalGoal || '',
                  wellbeingGoal: myGoal?.wellbeingGoal || '',
                  weeklyCommitment: myGoal?.weeklyCommitment || '',
                });
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-teal-600 hover:underline"
            >
              <Edit3 size={13} /> {myGoal ? 'Edit' : 'Set Goals'}
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Professional Goal</label>
              <input type="text" value={editGoal.professionalGoal} onChange={e => setEditGoal({ ...editGoal, professionalGoal: e.target.value })} placeholder="e.g., Complete 3 CPD modules" className={inputClass} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Wellbeing Goal</label>
              <input type="text" value={editGoal.wellbeingGoal} onChange={e => setEditGoal({ ...editGoal, wellbeingGoal: e.target.value })} placeholder="e.g., Daily 10-minute mindfulness" className={inputClass} />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Weekly Commitment</label>
              <input type="text" value={editGoal.weeklyCommitment} onChange={e => setEditGoal({ ...editGoal, weeklyCommitment: e.target.value })} placeholder="e.g., 2 hours study + daily practice" className={inputClass} />
            </div>
            <div className="flex items-center justify-end gap-3 mt-1">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 bg-teal-600 text-white font-bold text-sm rounded-xl hover:bg-teal-700 transition-all shadow-sm">Save Goals</button>
            </div>
          </div>
        ) : myGoal ? (
          <div className="flex flex-col gap-3">
            <GoalRow label="Professional" value={myGoal.professionalGoal} />
            <GoalRow label="Wellbeing" value={myGoal.wellbeingGoal} />
            <GoalRow label="Weekly" value={myGoal.weeklyCommitment} />
          </div>
        ) : (
          <p style={{ fontSize: 14 }} className="text-gray-500 italic">You haven't set your goals yet. Click "Set Goals" above to get started.</p>
        )}
      </div>

      {/* Other members' goals */}
      {goals.filter(g => g.memberId !== 'me').length > 0 && (
        <>
          <p style={{ fontSize: 15 }} className="text-gray-900 mt-2">Pod Members' Goals</p>
          {goals.filter(g => g.memberId !== 'me').map(goal => (
            <div key={goal.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  <ImageWithFallback src={goal.memberAvatar} alt={goal.memberName} className="w-full h-full object-cover" />
                </div>
                <p style={{ fontSize: 14 }} className="text-gray-900">{goal.memberName}</p>
              </div>
              <div className="flex flex-col gap-3">
                <GoalRow label="Professional" value={goal.professionalGoal} />
                <GoalRow label="Wellbeing" value={goal.wellbeingGoal} />
                <GoalRow label="Weekly" value={goal.weeklyCommitment} />
              </div>
            </div>
          ))}
        </>
      )}

      {goals.length === 0 && !isEditing && (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <Target size={22} className="text-gray-400" />
          </div>
          <p style={{ fontSize: 15 }} className="text-gray-700">No goals set yet</p>
          <p style={{ fontSize: 13 }} className="text-gray-500">Set your professional and wellbeing goals to get started.</p>
        </div>
      )}
    </div>
  );
}

function GoalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-2 px-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">{label}</span>
        <p style={{ fontSize: 14 }} className="text-gray-800">{value}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   SESSIONS TAB
   ═══════════════════════════════════════ */
function SessionsTab({ pod }: { pod: PeerPod }) {
  const [sessions] = useState<PodSession[]>(pod.sessions);

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      {sessions.map(session => (
        <div key={session.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <p style={{ fontSize: 16 }} className="text-gray-900">{session.title}</p>
            <a
              href={session.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 font-bold text-[12px] rounded-lg border border-teal-100 hover:bg-teal-100 transition-colors shrink-0"
            >
              <ExternalLink size={12} /> Join Link
            </a>
          </div>

          <div className="flex items-center gap-4 text-[13px] text-gray-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-gray-400" />
              <span>{session.date}</span>
            </div>
            <span className="text-gray-300">&middot;</span>
            <span>{session.time}</span>
          </div>

          {session.notes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Notes</p>
              <p style={{ fontSize: 14 }} className="text-gray-700 whitespace-pre-wrap">{session.notes}</p>
            </div>
          )}
        </div>
      ))}

      {sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <Calendar size={22} className="text-gray-400" />
          </div>
          <p style={{ fontSize: 15 }} className="text-gray-700">No sessions scheduled</p>
          <p style={{ fontSize: 13 }} className="text-gray-500">Sessions will appear here once they are scheduled by the pod.</p>
        </div>
      )}
    </div>
  );
}