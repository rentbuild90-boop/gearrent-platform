---
name: GearRent
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464554'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  container-padding-mobile: 16px
  container-padding-desktop: 32px
  sidebar-width: 280px
---

## Brand & Style
The design system is built on a foundation of **Corporate Modernism** with a focus on high-utility SaaS aesthetics. It balances the rugged reliability required for a rental marketplace with the sophisticated precision of an asset management platform. The visual language communicates trust, efficiency, and technological edge.

The interface prioritizes clarity through heavy whitespace and a restricted color palette, ensuring that the gear—the hero of the platform—is never overshadowed by the UI. Subtle depth and layered surfaces provide a sense of physical space, mimicking the tangible nature of the products being rented.

## Colors
This design system utilizes a high-contrast palette optimized for professional readability.
- **Electric Indigo (#6366F1)**: Used for primary actions, active states, and brand-identifying elements.
- **Emerald (#10B981)**: Specifically reserved for success states, "Available" gear indicators, and financial growth metrics.
- **Slate (#0F172A)**: The foundational neutral for typography and deep sidebar backgrounds in the dashboard experience.

Backgrounds utilize a tiered system of off-whites (`#F8FAFC`) to separate content areas without the harshness of pure white, while borders remain subtle to maintain a "borderless" feel where possible.

## Typography
Plus Jakarta Sans was selected for its modern, geometric construction which provides a tech-forward atmosphere while remaining highly legible at small sizes. 

Headlines use a tighter letter-spacing and heavier weights to create a strong visual hierarchy. Body text is set with a generous line height (`1.6`) to improve scanning speed during inventory management. Small labels utilize an uppercase transformation with increased letter spacing to differentiate metadata from actionable text.

## Layout & Spacing
The system follows a strict **8px Grid System**. All margins, paddings, and component heights must be multiples of 8 (or 4 for micro-adjustments).

**Mobile-First Renter Experience:**
Uses a fluid single-column layout with 16px horizontal margins. Horizontal scrolling is permitted for gear categories and featured listings to maximize vertical screen real estate.

**Internal Dashboard:**
Employs a fixed-width sidebar (280px) for navigation. The main content area uses a fluid 12-column grid with 24px gutters. Content should be grouped into cards to maintain organization within the expansive workspace.

## Elevation & Depth
Elevation is conveyed through **Ambient Shadows** and tonal layering rather than heavy borders. The design system uses three primary elevation levels:

1.  **Level 0 (Flat):** Background surfaces and inactive inputs.
2.  **Level 1 (Low):** Standard cards and secondary buttons. Shadow: `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)`.
3.  **Level 2 (High):** Modals, dropdown menus, and active hover states. Shadow: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`.

Use Slate-tinted shadows to maintain color harmony with the typography.

## Shapes
The system utilizes a "Rounded" geometry to soften the technical nature of the dashboard. 

- **Standard Elements (Buttons, Inputs):** 12px (`0.75rem`) corner radius.
- **Large Containers (Cards, Modals):** 16px (`1rem`) corner radius.
- **Selection Indicators (Chips, Radio Buttons):** Fully rounded/pill-shaped.

Visual consistency is maintained by ensuring that inner elements have a corner radius 4px smaller than their parent container if nested.

## Components
- **Buttons:** Primary buttons use Electric Indigo with white text. Secondary buttons use a Slate-tinted ghost style. Height is standardized at 48px for mobile accessibility and 40px for dashboard density.
- **Input Fields:** 12px radius with a 1px Slate-200 border. On focus, the border shifts to Electric Indigo with a 3px soft indigo glow.
- **Cards:** White surfaces with Level 1 elevation. For gear listings, cards feature a top-aligned image with a 1:1 aspect ratio on mobile and 4:3 on desktop.
- **Chips/Badges:** Used for "Availability." Emerald background with 10% opacity and solid Emerald text for high legibility without visual noise.
- **Sidebar:** For internal roles, the sidebar utilizes the Slate (#0F172A) background with Indigo active-state indicators (left-border or subtle background tint).
- **Inventory Lists:** High-density rows with 8px vertical padding, separated by 1px Slate-100 dividers. Hover states should trigger a subtle shift to the background color (`#F8FAFC`).