# PsycHire — Project Guidelines

## General

- Use **absolute imports** (`@/app/...`) for all project files.
- Use `cn()` from `@/app/components/ui/utils` to merge Tailwind classes.
- Keep file sizes small — extract helpers and sub-components into their own files.
- Prefer responsive, flexbox/grid layouts. Only use absolute positioning when necessary (e.g. card action overlays, modal close buttons).
- Refactor as you go to avoid duplication, but don't over-engineer.

## Colors & Theming

- **Never hardcode old brand colors** (`#35092c`, `#f6c845`, `#2A4CD0`, `#18cb96`). These are legacy.
- Use Tailwind semantic classes: `brand-primary`, `brand-secondary`, `bg-primary`, `text-foreground`, etc.
- For non-CSS contexts (charts, canvas), import from `@/app/design-system.ts`.
- The source of truth for all tokens is `src/styles/theme.css`.
- Dark mode is supported via `.dark` class and `dark:` prefix — ensure new components respect it.

## Layout

- All page content containers use: `max-w-[1440px] mx-auto px-6 lg:px-10`.
- Header is `sticky top-0 z-50` at `h-[72px]`.
- Mobile bottom nav is `fixed bottom-0 z-50` at `h-[60px]`.
- Modals use `z-[9999]`.

## Components

### Cards
- Always wrap in `group` class for coordinated hover effects.
- Standard padding: `p-5 sm:p-7` (standard), `p-4` (compact).
- Hover: `shadow-sm` → `shadow-lg`, border tints toward module color, title → `brand-primary`.
- Use `<ImageWithFallback />` for all images, avatars, and logos.
- Use `<FeaturedChip />` for featured state, with `ring-1 ring-brand-secondary border-brand-secondary` on card.

### Buttons
- Primary CTA: `bg-brand-secondary text-white font-bold rounded-lg`.
- Use shadcn `<Button>` variants for standard actions (primary, secondary, outline, ghost).
- Card icon buttons: `p-2 rounded-full`, fade in on hover.

### Forms & Inputs
- Input classes: `px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm`.
- Focus: `focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary`.
- Required fields: mark with `<span className="text-red-500">*</span>`.
- Disable submit when form is invalid: `disabled:opacity-70 disabled:cursor-not-allowed`.

### Modals
- Backdrop: `fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]`.
- Container: `rounded-2xl max-w-lg max-h-[90vh] overflow-hidden flex flex-col`.
- Use `max-w-2xl` for multi-column modals.
- Header/footer are `shrink-0`, content is `flex-1 overflow-y-auto`.

### Filters
- Container: `bg-white rounded-xl border border-gray-100 shadow-sm`.
- Use collapsible sections with `ChevronDown` rotation.
- Active filter pills: `bg-brand-primary/[0.07] text-brand-primary rounded-full`.
- Custom checkboxes: `w-[15px] h-[15px] rounded-[4px]`, checked: `bg-brand-primary`.

### Chips & Badges
- Chips: `rounded-full px-3 py-1 text-xs font-medium` with pastel variants.
- Status badges: `text-[10px] font-bold uppercase tracking-wider` with semantic colors.

## Typography

- Card titles: `font-bold text-gray-900`, hover → `text-brand-primary`.
- Body text: `text-sm text-gray-500 leading-relaxed`.
- Descriptions: clamp with `line-clamp-2` or `line-clamp-3`.
- Meta text: `text-[11px]` or `text-xs`, `text-gray-400` or `text-gray-500`.

## Icons

- Primary library: **Lucide React** (`lucide-react`).
- Default stroke: `strokeWidth={1.5}`.
- Sizes: 10-12 (badges), 14-16 (metadata), 18 (card actions), 20 (nav/default).
- Muted icons: `text-gray-400`, hover → `text-brand-primary`.

## Animations

- Standard: `transition-all duration-300`.
- Opacity reveal: `transition-opacity duration-200`.
- Button press: `active:scale-[0.97]`.
- Dialogs: `animate-in fade-in-0 zoom-in-95` / `animate-out fade-out-0 zoom-out-95`.

## Responsive

- Mobile-first approach.
- Key breakpoints: `sm` (640px), `md` (768px), `lg` (1024px).
- Desktop nav: `hidden lg:flex`. Mobile hamburger: `lg:hidden`.
- Use `useIsMobile()` hook (768px threshold) for JS-level responsive logic.

## Role-Based UI

- Four user roles: **Student**, **Professional**, **Company**, **Admin**.
- Navigation items, dashboard pages, and feature access vary by role.
- Role type: `UserGroup` from `@/app/data/profile`.

## Accessibility

- Focus rings: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`.
- Error states: `aria-invalid:ring-destructive/20 aria-invalid:border-destructive`.
- Disabled: `disabled:pointer-events-none disabled:opacity-50`.
