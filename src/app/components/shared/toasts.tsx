/**
 * toasts.tsx — Branded toast helpers for PsycHIRE.
 * Uses sonner under the hood. Import these helpers instead of using toast() directly.
 */

import { toast } from 'sonner';
import React from 'react';
import {
  Bookmark,
  BookmarkX,
  Share2,
  Flag,
  CheckCircle2,
  Send,
  UserPlus,
  CalendarCheck,
  FileCheck,
  Trash2,
  AlertTriangle,
  Copy,
  Heart,
  Users,
  GraduationCap,
  BookOpen,
  Star,
} from 'lucide-react';

/* ── Helpers ── */

function ToastIcon({ icon: Icon, bg, color }: { icon: React.ElementType; bg: string; color: string }) {
  return (
    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
      <Icon size={15} className={color} />
    </div>
  );
}

/* ── Bookmark Toasts ── */

export function toastBookmarkAdded(itemType: 'job' | 'project' | 'course' | 'funding' | 'event' = 'job') {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={Bookmark} bg="bg-blue-50" color="text-[#1e40af]" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Saved to bookmarks</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">
          {itemType === 'job' ? 'Job' : itemType === 'project' ? 'Project' : itemType === 'course' ? 'Course' : itemType === 'event' ? 'Event' : 'Opportunity'} added to your saved items
        </p>
      </div>
    </div>,
    { duration: 2500 }
  );
}

export function toastBookmarkRemoved(itemType: 'job' | 'project' | 'course' | 'funding' | 'event' = 'job') {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={BookmarkX} bg="bg-gray-50" color="text-gray-500" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Removed from saved</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">
          {itemType === 'job' ? 'Job' : itemType === 'project' ? 'Project' : itemType === 'course' ? 'Course' : itemType === 'event' ? 'Event' : 'Opportunity'} removed from bookmarks
        </p>
      </div>
    </div>,
    { duration: 2000 }
  );
}

/* ── Share / Copy Toasts ── */

export function toastLinkCopied() {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={Copy} bg="bg-teal-50" color="text-teal-600" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Link copied!</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">Share link has been copied to your clipboard</p>
      </div>
    </div>,
    { duration: 2000 }
  );
}

export function toastShared(platform: string) {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={Share2} bg="bg-indigo-50" color="text-indigo-600" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Opening {platform}</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">Redirecting to share...</p>
      </div>
    </div>,
    { duration: 1500 }
  );
}

/* ── Report Toast ── */

export function toastReportSubmitted() {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={Flag} bg="bg-red-50" color="text-red-500" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Report submitted</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">Our team will review this within 24 hours</p>
      </div>
    </div>,
    { duration: 3000 }
  );
}

/* ── Application Toasts ── */

export function toastApplicationSubmitted(title?: string) {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={Send} bg="bg-teal-50" color="text-teal-600" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Application sent!</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">
          {title ? `Applied to "${title}"` : 'Your application has been submitted'}
        </p>
      </div>
    </div>,
    { duration: 3000 }
  );
}

/* ── Referral Toasts ── */

export function toastReferralCreated() {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={UserPlus} bg="bg-purple-50" color="text-purple-600" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Referral published!</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">Your referral request is now live</p>
      </div>
    </div>,
    { duration: 3000 }
  );
}

export function toastReferralResponded() {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={CheckCircle2} bg="bg-teal-50" color="text-teal-600" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Response submitted!</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">The referrer has been notified</p>
      </div>
    </div>,
    { duration: 3000 }
  );
}

/* ── Community / Network Toasts ── */

export function toastJoinedCircle(name?: string) {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={Users} bg="bg-indigo-50" color="text-indigo-600" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Joined circle!</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">
          {name ? `You're now a member of ${name}` : 'Welcome to the community circle'}
        </p>
      </div>
    </div>,
    { duration: 2500 }
  );
}

export function toastLeftCircle() {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={Users} bg="bg-gray-50" color="text-gray-500" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Left circle</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">You've left the community circle</p>
      </div>
    </div>,
    { duration: 2000 }
  );
}

export function toastConnected(name?: string) {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={UserPlus} bg="bg-blue-50" color="text-[#1e40af]" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Connection request sent!</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">
          {name ? `Sent to ${name}` : 'Your request is pending'}
        </p>
      </div>
    </div>,
    { duration: 2500 }
  );
}

export function toastFollowedCompany(name?: string) {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={Heart} bg="bg-pink-50" color="text-pink-500" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Following company</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">
          {name ? `You'll get updates from ${name}` : "You'll receive updates from this company"}
        </p>
      </div>
    </div>,
    { duration: 2500 }
  );
}

/* ── Event Toasts ── */

export function toastEventRSVP(eventTitle?: string) {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={CalendarCheck} bg="bg-teal-50" color="text-teal-600" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">RSVP confirmed!</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">
          {eventTitle ? `You're attending "${eventTitle}"` : 'Added to your calendar'}
        </p>
      </div>
    </div>,
    { duration: 3000 }
  );
}

/* ── Listing CRUD Toasts ── */

export function toastListingCreated(type: 'job' | 'project') {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={FileCheck} bg="bg-teal-50" color="text-teal-600" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">{type === 'job' ? 'Job' : 'Project'} published!</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">Your listing is now live on PsycHIRE</p>
      </div>
    </div>,
    { duration: 3000 }
  );
}

export function toastListingDeleted(type: 'job' | 'project') {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={Trash2} bg="bg-red-50" color="text-red-500" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">{type === 'job' ? 'Job' : 'Project'} deleted</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">The listing has been permanently removed</p>
      </div>
    </div>,
    { duration: 3000 }
  );
}

/* ── Funding Toasts ── */

export function toastFundingApplied(title?: string) {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={GraduationCap} bg="bg-amber-50" color="text-amber-600" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Application submitted!</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">
          {title ? `Applied to "${title}"` : 'Your funding application is being reviewed'}
        </p>
      </div>
    </div>,
    { duration: 3000 }
  );
}

/* ── Course Toasts ── */

export function toastCourseEnrolled(title?: string) {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={BookOpen} bg="bg-purple-50" color="text-purple-600" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Enrolled successfully!</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">
          {title ? `You're enrolled in "${title}"` : 'Check your enrolled courses in the Learning tab'}
        </p>
      </div>
    </div>,
    { duration: 3000 }
  );
}

export function toastReviewSubmitted() {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={Star} bg="bg-amber-50" color="text-amber-500" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">Review submitted!</p>
        <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">Thank you for your feedback</p>
      </div>
    </div>,
    { duration: 2500 }
  );
}

/* ── Generic Warning Toast ── */

export function toastWarning(message: string, description?: string) {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={AlertTriangle} bg="bg-amber-50" color="text-amber-500" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">{message}</p>
        {description && <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">{description}</p>}
      </div>
    </div>,
    { duration: 3000 }
  );
}

/* ── Generic Success Toast ── */

export function toastSuccess(message: string, description?: string) {
  toast(
    <div className="flex items-center gap-3">
      <ToastIcon icon={CheckCircle2} bg="bg-teal-50" color="text-teal-600" />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600 }} className="text-gray-900">{message}</p>
        {description && <p style={{ fontSize: 12 }} className="text-gray-500 mt-0.5">{description}</p>}
      </div>
    </div>,
    { duration: 2500 }
  );
}