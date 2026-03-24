/**
 * QAForum — Fully interactive Q&A component for Hub pages.
 * Supports: ask questions, expand/collapse threads, reply to questions,
 * upvote, and mark as resolved.
 */

import React, { useState } from 'react';
import {
  HelpCircle, CheckCircle2, ChevronDown, ChevronUp,
  MessageSquare, Send, ThumbsUp, Plus, X,
} from 'lucide-react';

/* ═══ Types ═══ */

export interface QAReply {
  id: string;
  author: string;
  text: string;
  date: string;
  isInstructor?: boolean;
}

export interface QAItem {
  id: string;
  question: string;
  askedBy: string;
  date: string;
  answer?: string;
  replies?: QAReply[];
  upvotes?: number;
  isResolved?: boolean;
}

interface QAForumProps {
  items: QAItem[];
  accentColor?: string;        // e.g. 'indigo' | 'cyan'
  instructorLabel?: string;    // e.g. 'Mentor Response' | 'Supervisor Response'
}

/* ═══ Component ═══ */

export function QAForum({ items, accentColor = 'indigo', instructorLabel = 'Mentor Response' }: QAForumProps) {
  const [questions, setQuestions] = useState<QAItem[]>(items);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showAskForm, setShowAskForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  const accent = accentColor === 'cyan'
    ? { bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-600', darkText: 'text-cyan-800', darkBg: 'bg-cyan-600', hoverBg: 'hover:bg-cyan-700', lightBg: 'bg-cyan-100', pill: 'bg-cyan-50 text-cyan-700 border-cyan-200' }
    : { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600', darkText: 'text-indigo-800', darkBg: 'bg-indigo-600', hoverBg: 'hover:bg-indigo-700', lightBg: 'bg-indigo-100', pill: 'bg-indigo-50 text-indigo-700 border-indigo-200' };

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) return;
    const q: QAItem = {
      id: `q-${Date.now()}`,
      question: newQuestion.trim(),
      askedBy: 'You',
      date: 'Just now',
      replies: [],
      upvotes: 0,
      isResolved: false,
    };
    setQuestions(prev => [q, ...prev]);
    setNewQuestion('');
    setShowAskForm(false);
  };

  const handleReply = (questionId: string) => {
    if (!replyText.trim()) return;
    const reply: QAReply = {
      id: `r-${Date.now()}`,
      author: 'You',
      text: replyText.trim(),
      date: 'Just now',
    };
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      return { ...q, replies: [...(q.replies || []), reply] };
    }));
    setReplyText('');
    setReplyingTo(null);
  };

  const handleUpvote = (questionId: string) => {
    const newSet = new Set(upvotedIds);
    if (newSet.has(questionId)) {
      newSet.delete(questionId);
      setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, upvotes: Math.max(0, (q.upvotes || 0) - 1) } : q));
    } else {
      newSet.add(questionId);
      setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, upvotes: (q.upvotes || 0) + 1 } : q));
    }
    setUpvotedIds(newSet);
  };

  const handleResolve = (questionId: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, isResolved: !q.isResolved } : q));
  };

  const totalReplies = (q: QAItem) => (q.replies?.length || 0) + (q.answer ? 1 : 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Questions & Answers</p>
        <button
          onClick={() => setShowAskForm(true)}
          className={`flex items-center gap-2 px-4 py-2.5 ${accent.darkBg} text-white rounded-xl ${accent.hoverBg} transition-all`}
          style={{ fontSize: 13, fontWeight: 700 }}
        >
          <Plus size={16} /> Ask Question
        </button>
      </div>

      {/* Ask Question Form */}
      {showAskForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>Ask a New Question</p>
            <button onClick={() => { setShowAskForm(false); setNewQuestion(''); }} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={14} />
            </button>
          </div>
          <textarea
            value={newQuestion}
            onChange={e => setNewQuestion(e.target.value)}
            className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${accentColor}-100 focus:border-${accentColor}-400 resize-none`}
            style={{ fontSize: 13 }}
            rows={3}
            placeholder="Type your question here…"
            autoFocus
          />
          <div className="flex items-center justify-end mt-3 gap-2">
            <button
              onClick={() => { setShowAskForm(false); setNewQuestion(''); }}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              onClick={handleAskQuestion}
              disabled={!newQuestion.trim()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${newQuestion.trim() ? `${accent.darkBg} text-white ${accent.hoverBg}` : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              style={{ fontSize: 12, fontWeight: 700 }}
            >
              <Send size={14} /> Post Question
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 bg-white rounded-2xl border border-dashed border-gray-200">
          <HelpCircle size={28} className="text-gray-300 mb-3" />
          <p className="text-gray-500" style={{ fontSize: 14 }}>No questions yet</p>
          <p className="text-gray-400 mt-1" style={{ fontSize: 12 }}>Be the first to ask a question!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map(item => {
            const isExpanded = expandedId === item.id;
            const replyCount = totalReplies(item);
            const isReplying = replyingTo === item.id;
            const isUpvoted = upvotedIds.has(item.id);

            return (
              <div key={item.id} className={`bg-white rounded-2xl border shadow-sm transition-all ${item.isResolved ? 'border-green-200 bg-green-50/20' : 'border-gray-100'}`}>
                {/* Question Header */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${accent.lightBg} ${accent.text} flex items-center justify-center shrink-0 mt-0.5`}>
                      {item.isResolved ? <CheckCircle2 size={16} className="text-green-600" /> : <HelpCircle size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>{item.question}</p>
                        {item.isResolved && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200 shrink-0" style={{ fontSize: 10, fontWeight: 700 }}>
                            <CheckCircle2 size={10} /> Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mt-1" style={{ fontSize: 11 }}>Asked by {item.askedBy} · {item.date}</p>
                    </div>
                  </div>

                  {/* Instructor Answer Preview (always visible) */}
                  {item.answer && !isExpanded && (
                    <div className={`ml-11 mt-3 p-3 ${accent.bg} rounded-xl ${accent.border} border`}>
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 size={12} className={accent.text} />
                        <p className={accent.darkText} style={{ fontSize: 11, fontWeight: 700 }}>{instructorLabel}</p>
                      </div>
                      <p className={`${accent.text}`} style={{ fontSize: 13, lineHeight: 1.5 }}>
                        {item.answer.length > 120 ? item.answer.slice(0, 120) + '…' : item.answer}
                      </p>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="flex items-center gap-4 ml-11 mt-3 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => handleUpvote(item.id)}
                      className={`flex items-center gap-1.5 transition-colors ${isUpvoted ? accent.text : 'text-gray-400 hover:text-gray-600'}`}
                      style={{ fontSize: 12, fontWeight: isUpvoted ? 700 : 500 }}
                    >
                      <ThumbsUp size={13} fill={isUpvoted ? 'currentColor' : 'none'} />
                      {(item.upvotes || 0) > 0 ? item.upvotes : 'Upvote'}
                    </button>
                    <button
                      onClick={() => {
                        if (isExpanded) {
                          setExpandedId(null);
                          setReplyingTo(null);
                        } else {
                          setExpandedId(item.id);
                        }
                      }}
                      className={`flex items-center gap-1.5 transition-colors ${isExpanded ? accent.text : 'text-gray-400 hover:text-gray-600'}`}
                      style={{ fontSize: 12, fontWeight: isExpanded ? 700 : 500 }}
                    >
                      <MessageSquare size={13} />
                      {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                      {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                    <button
                      onClick={() => handleResolve(item.id)}
                      className={`flex items-center gap-1 transition-colors ml-auto ${item.isResolved ? 'text-green-600' : 'text-gray-400 hover:text-green-600'}`}
                      style={{ fontSize: 11, fontWeight: 600 }}
                    >
                      <CheckCircle2 size={12} /> {item.isResolved ? 'Resolved' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>

                {/* Expanded Replies Section */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-2xl px-5 sm:px-6 py-4 flex flex-col gap-3 animate-fade-in">
                    {/* Instructor answer (full) */}
                    {item.answer && (
                      <div className={`p-4 ${accent.bg} rounded-xl ${accent.border} border`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-7 h-7 rounded-full ${accent.lightBg} ${accent.text} flex items-center justify-center`} style={{ fontSize: 10, fontWeight: 700 }}>
                            S
                          </div>
                          <div>
                            <p className={accent.darkText} style={{ fontSize: 12, fontWeight: 700 }}>{instructorLabel}</p>
                          </div>
                        </div>
                        <p className={accent.text} style={{ fontSize: 13, lineHeight: 1.6 }}>{item.answer}</p>
                      </div>
                    )}

                    {/* Community Replies */}
                    {(item.replies || []).map(reply => (
                      <div key={reply.id} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100">
                        <div className={`w-7 h-7 rounded-full ${reply.isInstructor ? accent.lightBg : 'bg-gray-100'} ${reply.isInstructor ? accent.text : 'text-gray-500'} flex items-center justify-center shrink-0`} style={{ fontSize: 10, fontWeight: 700 }}>
                          {reply.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-gray-900" style={{ fontSize: 12, fontWeight: 700 }}>{reply.author}</p>
                            {reply.isInstructor && (
                              <span className={`px-1.5 py-px rounded text-[9px] ${accent.pill} border`} style={{ fontWeight: 700 }}>Instructor</span>
                            )}
                            <span className="text-gray-400" style={{ fontSize: 10 }}>{reply.date}</span>
                          </div>
                          <p className="text-gray-700 mt-1" style={{ fontSize: 13, lineHeight: 1.5 }}>{reply.text}</p>
                        </div>
                      </div>
                    ))}

                    {/* Reply Input */}
                    {isReplying ? (
                      <div className="flex items-start gap-2 mt-1">
                        <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0" style={{ fontSize: 10, fontWeight: 700 }}>
                          Y
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-none"
                            style={{ fontSize: 13 }}
                            rows={2}
                            placeholder="Write your reply…"
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-2 mt-2">
                            <button
                              onClick={() => { setReplyingTo(null); setReplyText(''); }}
                              className="px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                              style={{ fontSize: 12, fontWeight: 600 }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReply(item.id)}
                              disabled={!replyText.trim()}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${replyText.trim() ? `${accent.darkBg} text-white ${accent.hoverBg}` : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                              style={{ fontSize: 12, fontWeight: 700 }}
                            >
                              <Send size={12} /> Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(item.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-white transition-all self-start`}
                        style={{ fontSize: 12, fontWeight: 600 }}
                      >
                        <MessageSquare size={13} /> Write a reply…
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
