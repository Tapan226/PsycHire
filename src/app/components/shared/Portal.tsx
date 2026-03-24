/**
 * Portal — Renders children into document.body via React Portal.
 *
 * WHY THIS EXISTS:
 * Page wrappers use `animate-fade-in` (with `forwards` fill-mode), which
 * creates a permanent CSS stacking context.  Any `position: fixed` modal
 * rendered inside that stacking context is trapped — its z-index is
 * relative to the page wrapper (z: auto → 0), not the viewport.  The
 * sticky header at z-50 therefore always paints on top.
 *
 * Wrapping a modal in <Portal> renders it directly under <body>, outside
 * every intermediate stacking context, so z-index works as expected.
 */

import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

export function Portal({ children }: PortalProps) {
  return createPortal(children, document.body);
}
