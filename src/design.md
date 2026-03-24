# PsycHIRE Design System

> **Source of truth**: [`src/styles/theme.css`](src/styles/theme.css) defines all CSS custom properties.
> [`src/app/design-system.ts`](src/app/design-system.ts) exports JS constants for non-CSS contexts (Canvas, Charts, third-party libs).

---

## 1. Core Identity

- **Primary Color:** `#1e40af` (Royal Blue) — branding, active states, primary actions, focus rings.
- **Secondary/Accent:** `#14b8a6` (Teal) — CTA buttons, featured badges, accent highlights.
- **Font Family:** Inter (`font-['Inter', sans-serif]`), weights 400/500/600/700.
- **Theme:** Professional, spacious, with polished micro-interactions and role-based UI.

---

## 2. Color Palette

### Brand Colors

| Token                      | Value     | Tailwind Class              | Usage                              |
|----------------------------|-----------|-----------------------------|------------------------------------|
| `--brand-primary`          | `#1e40af` | `brand-primary`             | Primary actions, links, active nav |
| `--brand-secondary`        | `#14b8a6` | `brand-secondary`           | CTA buttons, featured badges       |
| `--brand-secondary-hover`  | `#0d9488` | `brand-secondary-hover`     | Hover state for secondary CTAs     |

### Semantic UI Colors (Light Mode)

| Token              | Value                    | Usage                  |
|--------------------|--------------------------|------------------------|
| `--background`     | `#f0f4f8`                | App background         |
| `--foreground`     | `#0F172A`                | Primary text           |
| `--card`           | `#ffffff`                | Card surfaces          |
| `--primary`        | `#1e40af`                | Primary action buttons |
| `--secondary`      | `#f3f3f5`                | Secondary backgrounds  |
| `--accent`         | `#14b8a6`                | Accent/highlight       |
| `--muted`          | `#ececf0`                | Muted backgrounds      |
| `--muted-foreground` | `#64748B`              | Muted/tertiary text    |
| `--destructive`    | `#d4183d`                | Error/danger actions   |
| `--border`         | `#e2e8f0`                | Borders (Slate 200)    |
| `--input`          | `#e2e2e2`                | Input field borders    |
| `--ring`           | `#1e40af`                | Focus rings            |

### Dark Mode Overrides

| Token          | Light       | Dark                      |
|----------------|-------------|---------------------------|
| `--background` | `#f0f4f8`   | `#0F172A`                 |
| `--card`       | `#ffffff`   | `#1E293B`                 |
| `--primary`    | `#1e40af`   | `#2A4CD0`                 |
| `--accent`     | `#14b8a6`   | `#18cb96`                 |
| `--border`     | `#e2e8f0`   | `rgba(255, 255, 255, 0.1)` |

### Text Color Hierarchy

`gray-900` (primary headings) → `gray-700` (secondary) → `gray-500`/`gray-600` (tertiary body) → `gray-400` (disabled/meta)

### Chip Colors (Muted/Pastel)

Always use `text-gray-900` on these backgrounds:

| Name   | Background    |
|--------|---------------|
| Mint   | `bg-[#E0EFEA]` |
| Blue   | `bg-[#E0EBF5]` |
| Purple | `bg-[#EBE0F5]` |
| Amber  | `bg-[#F5EFE0]` |
| Rose   | `bg-[#F5E0E5]` |
| Slate  | `bg-[#F0F2F5]` |

### Module/Action Card Colors

| Module    | Background     |
|-----------|----------------|
| Jobs      | `bg-[#E6F0FF]` |
| Community | `bg-[#E9F5E6]` |
| Courses   | `bg-[#FDF2E9]` |
| Events    | `bg-[#F5E6FF]` |

### Status Badge Colors

| Status        | Background   | Text         | Border        |
|---------------|-------------|--------------|---------------|
| Success/New   | `green-50`  | `green-700`  | `green-200`   |
| Warning       | `amber-50`  | `amber-700`  | `amber-200`   |
| Urgent/Error  | `red-50`    | `red-700`    | `red-200`     |
| Info          | `blue-50`   | `blue-700`   | `blue-200`    |
| Neutral       | `gray-50`   | `gray-700`   | `gray-200`    |

### Chart Colors

| Token       | Value     |
|-------------|-----------|
| `--chart-1` | `#1e40af` |
| `--chart-2` | `#14b8a6` |
| `--chart-3` | `#64748B` |
| `--chart-4` | `#818CF8` |
| `--chart-5` | `#2DD4BF` |

---

## 3. Typography

| Level      | Tailwind Classes                                | Weight | Line Height | Tracking   |
|------------|------------------------------------------------|--------|-------------|------------|
| H1         | `text-3xl font-bold`                           | 700    | 1.2         | `-0.02em`  |
| H2         | `text-2xl font-bold`                           | 700    | 1.3         | `-0.01em`  |
| H3         | `text-xl font-medium`                          | 500    | 1.4         | —          |
| H4         | `text-lg font-medium`                          | 500    | 1.5         | —          |
| Body       | `text-sm leading-relaxed`                      | 400    | ~1.625      | —          |
| Small/Meta | `text-xs` or `text-[11px]` `font-medium`       | 500    | —           | —          |
| Badge      | `text-[10px] font-bold uppercase tracking-wider` | 700  | —           | wider      |
| Nav Items  | `text-[15px] font-medium`                       | 500   | —           | —          |

### Card Title Pattern
- Size: `text-lg` or `text-xl` or `style={{ fontSize: 17 }}`
- Weight: `font-bold`
- Color: `text-gray-900`, hover: `group-hover:text-brand-primary`
- Truncation: `line-clamp-2` or `line-clamp-3`

---

## 4. Layout & Spacing

### Container
```
max-w-[1440px] mx-auto px-6 lg:px-10
```

### Key Measurements

| Element            | Value                  |
|--------------------|------------------------|
| Max width          | `1440px`               |
| Horizontal padding | `px-6` mobile, `lg:px-10` desktop |
| Header height      | `h-[72px]`             |
| Mobile bottom nav  | `h-[60px]`             |

### Vertical Rhythm

| Context                    | Gap                |
|----------------------------|--------------------|
| Between major sections     | `gap-8` to `gap-20` |
| Card grids                 | `gap-6` to `gap-8` |
| Inside card sections       | `gap-4 sm:gap-6`   |
| Form fields                | `gap-5` to `gap-6`  |
| Label to input             | `gap-2`            |
| Compact items              | `gap-1.5` to `gap-2` |

### Component Padding

| Component          | Padding                              |
|--------------------|--------------------------------------|
| Cards (standard)   | `p-5 sm:p-7`                        |
| Cards (compact)    | `p-4`                               |
| Modal header       | `px-8 py-6`                         |
| Modal content      | `p-8`                               |
| Modal footer       | `p-6`                               |
| Inputs             | `px-4 py-3`                         |
| Buttons (default)  | `h-9 px-4 py-2`                     |
| Buttons (CTA)      | `px-8 py-2.5`                       |
| Chips              | `px-3 py-1`                         |
| Badges             | `px-2 py-0.5`                       |
| Filter header      | `px-4 py-3`                         |

---

## 5. Border Radius

| Token          | Value   | Usage                        |
|----------------|---------|------------------------------|
| `--radius-sm`  | `8px`   | Small UI controls            |
| `--radius-md`  | `10px`  | Buttons, badges, inputs      |
| `--radius-lg`  | `12px`  | Default (base `--radius`)    |
| `--radius-xl`  | `16px`  | Cards, dialogs               |
| `rounded-full` | `9999px`| Chips, avatars, nav pills    |
| `rounded-2xl`  | —       | Modals, profile popovers     |

---

## 6. Shadows & Elevation

| State    | Class        | Usage                        |
|----------|-------------|------------------------------|
| Resting  | `shadow-sm`  | Cards, filters, badges       |
| Hover    | `shadow-lg`  | Card hover states            |
| Elevated | `shadow-2xl` | Modals, popovers, dropdowns  |

All shadow transitions use `transition-all duration-300`.

---

## 7. Components

### Buttons

| Variant        | Classes                                                                    |
|----------------|---------------------------------------------------------------------------|
| Primary CTA    | `bg-brand-secondary text-white rounded-lg font-bold hover:bg-brand-secondary-hover` |
| Primary action | `bg-primary text-primary-foreground hover:bg-primary/90`                  |
| Secondary      | `bg-secondary text-secondary-foreground hover:bg-secondary/80`           |
| Outline        | `border bg-background hover:bg-accent hover:text-accent-foreground`      |
| Ghost          | `hover:bg-accent hover:text-accent-foreground`                           |
| Link           | `text-primary underline-offset-4 hover:underline`                       |
| Icon button    | `p-2 rounded-full` (card action buttons)                                 |

Button sizes: `sm` (h-8), `default` (h-9), `lg` (h-10), `icon` (size-9).

Disabled: `disabled:opacity-50 disabled:pointer-events-none` (shadcn), `disabled:opacity-70 disabled:cursor-not-allowed` (forms).

Active press: `active:scale-[0.97] duration-200`.

### Cards (Universal Pattern)

```
rounded-xl border border-gray-100 shadow-sm
hover:shadow-lg hover:border-[module-color]-200
transition-all duration-300
group
```

**Hover behaviors (coordinated via `group-hover`):**
1. **Title** → `group-hover:text-brand-primary transition-colors`
2. **Shadow** → `shadow-sm` to `shadow-lg`
3. **Border** → tints toward module color (blue-200, teal-200, indigo-200, etc.)
4. **Action buttons** → `opacity-0 → group-hover:opacity-100` (fade in)
5. **CTA arrow** → `group-hover/btn:translate-x-0.5 transition-transform`
6. **Images** → `group-hover:scale-[1.02]` or `group-hover:scale-105`

**Featured state:** `ring-1 ring-brand-secondary border-brand-secondary` + `<FeaturedChip />`.

**Card structure:** Header (logo/avatar + title + chips) → Body (description) → Footer (`mt-auto border-t border-gray-100 pt-4`).

### Inputs

```
px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm
focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary
transition-all
```

Icons: `absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400`.
Disabled: `bg-gray-50 text-gray-500 cursor-not-allowed`.
Select chevron: `absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none`.

### Modals

```
Portal → fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]
→ rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col
  Header:  px-8 py-6, border-b border-gray-100, shrink-0
  Content: p-8, overflow-y-auto, flex-1
  Footer:  p-6, border-t border-gray-100, shrink-0
```

Sizes: `max-w-lg` (standard), `max-w-2xl` (multi-column forms).

### Filters

```
bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden
```

- **Header:** `px-4 py-3 border-b bg-gray-50/50` with icon + "Filters" label + active count badge + "Clear all" link.
- **Active pills:** `bg-brand-primary/[0.07] text-brand-primary rounded-full text-[11px]` with X dismiss.
- **Collapsible sections:** `ChevronDown` rotates 180deg, `max-h` animation for open/close.
- **Checkboxes:** `w-[15px] h-[15px] rounded-[4px] border-[1.5px]`, checked: `bg-brand-primary border-brand-primary`.
- **Location:** Cascading country → state → city with `<select>` dropdowns.

### Chips (`Chip.tsx`)

- **Style:** `rounded-full px-3 py-1 text-xs font-medium`
- **Variants:** Pastel backgrounds (mint, blue, purple, amber, rose, slate) with `text-gray-900`.
- **No border.**

### Featured Chip (`FeaturedChip.tsx`)

- **Style:** `bg-brand-secondary text-white shadow-sm font-bold`

### Status Badges

- **Style:** `inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full`
- **Colors:** Semantic (green=new/active, amber=warning, red=urgent, blue=info).

### Header (`Header.tsx`)

- **Sticky:** `sticky top-0 z-50 bg-white/95 backdrop-blur-md`
- **Single row:** `h-[72px]`, three-column flex layout (logo | nav | actions).
- **Nav pills:** `px-4 py-2.5 rounded-full`, active: `bg-brand-primary/10 text-brand-primary font-semibold`.
- **Mobile:** Hamburger below `lg`, opens right drawer `w-[280px]` at `z-[101]`.
- **Role-based nav:** Student, Professional, Company, Admin each have tailored items.

### Mobile Bottom Nav (`MobileBottomNav.tsx`)

- `fixed bottom-0 z-50 h-[60px]` with `safe-area-inset-bottom`.
- Active indicator: `w-8 h-0.5 rounded-full bg-[#1e40af]` accent bar at top.
- Smart page mapping for nested routes.

### Tooltips

- `bg-brand-primary text-white rounded-md shadow-lg px-2.5 py-1.5`
- Animation: `animate-fade-in`.

### Avatars & Images

- **Circular avatars:** `rounded-full border border-gray-100 bg-gray-50`.
- **Sizes:** `w-6 h-6` (xs), `w-8 h-8`/`w-9 h-9` (sm), `w-10 h-10`/`w-11 h-11` (md), `w-14 h-14` (lg).
- **Square logos:** `rounded-lg` or `rounded-xl` with `border border-gray-100`.
- **Banner images:** `overflow-hidden` on parent, `group-hover:scale-[1.02]` zoom.
- **Always use `<ImageWithFallback />`** — falls back to SVG placeholder on error.

---

## 8. Responsive Design

### Breakpoints (Tailwind defaults)

| Breakpoint | Width  | Key Usage                            |
|------------|--------|--------------------------------------|
| `sm`       | 640px  | Card padding `sm:p-7`, footer layout |
| `md`       | 768px  | Grid columns, form 2-col layouts     |
| `lg`       | 1024px | Desktop nav, `lg:px-10` padding      |

Mobile detection: `useIsMobile()` hook at 768px threshold.

### Common Responsive Patterns

- **Card padding:** `p-5 sm:p-7`
- **Container padding:** `px-6 lg:px-10`
- **Footer layout:** `flex flex-col sm:flex-row sm:items-center sm:justify-between`
- **Grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (or `lg:grid-cols-4`)
- **Nav visibility:** `hidden lg:flex` (desktop), `lg:hidden` (mobile)

---

## 9. Animations & Transitions

| Pattern          | Value                                       |
|------------------|---------------------------------------------|
| Default          | `transition-all duration-300`               |
| Color only       | `transition-colors`                         |
| Opacity reveal   | `transition-opacity duration-200`           |
| Transform        | `transition-transform`                      |
| Button press     | `active:scale-[0.97] duration-200`          |
| Fade in          | `animate-fade-in` (0.5s ease-out)           |
| Dialog open      | `animate-in fade-in-0 zoom-in-95`           |
| Dialog close     | `animate-out fade-out-0 zoom-out-95`        |
| Collapsible      | `max-h` + `opacity` transition (200ms)       |

---

## 10. Focus & Accessibility

### Focus Ring (shadcn standard)
```
focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
```

### Invalid/Error State
```
aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
```

### Disabled State
```
disabled:pointer-events-none disabled:opacity-50
```

### Validation Feedback
- Required indicator: `<span className="text-red-500">*</span>`
- Warning box: `bg-amber-50 border border-amber-100 rounded-xl`
- Success box: `bg-emerald-50 border border-emerald-100 rounded-xl`
- Info box: `bg-purple-50 border border-purple-100 rounded-xl`

---

## 11. Iconography

- **Primary library:** Lucide React (`lucide-react`).
- **Secondary:** MUI Icons (`@mui/icons-material`) for specific cases.
- **Default stroke:** `strokeWidth={1.5}` (Icon component).
- **Smaller icons:** `strokeWidth={1.8}` to `2`.

### Icon Sizes

| Context       | Size          |
|---------------|---------------|
| Badge icons   | `size={10-12}` |
| Footer meta   | `size={14-16}` |
| Card actions  | `size={18}`    |
| Nav/default   | `size={20}`    |

### Icon Color
- Default: `currentColor`
- Muted: `text-gray-400`
- Hover: `hover:text-brand-primary`

---

## 12. Implementation Rules

1. **Shadows:** Start with `shadow-sm`, elevate to `shadow-lg` on hover.
2. **Transitions:** Use `transition-all duration-300` for smooth interactions.
3. **Images:** Always use `<ImageWithFallback />` for robustness.
4. **Imports:** Use absolute imports `@/app/...`.
5. **Utilities:** Use `cn()` from `@/app/components/ui/utils` to merge Tailwind classes.
6. **Card hover:** Always use `group` class on card root for coordinated hover effects.
7. **Text truncation:** Use `line-clamp-2` or `line-clamp-3` for descriptions.
8. **Modal z-index:** Use `z-[9999]` for modals, `z-50` for header/nav.
9. **Scrollbar:** Use `.scrollbar-hide` class when scroll indicators aren't needed.
10. **Dark mode:** Supported via `.dark` class and `dark:` Tailwind prefix.
