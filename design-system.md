MIDAS STOCK DESIGN SYSTEM
Design Philosophy

The design system should communicate:

Financial trust
Institutional credibility
Modern fintech identity
Premium but minimal experience
High readability
Strong visual hierarchy

The overall UI should feel:

clean
elegant
spacious
stable
modern
professional
25. CORE COLOR SYSTEM
Design Direction

The color palette is based on:

Navy blue for trust and authority
Gold for premium identity
Emerald green for growth and financial positivity
Slate neutrals for readability and balance
PRIMARY BRAND COLORS
Navy System
primary: {
  50: '#EEF4FF',
  100: '#D9E7FF',
  200: '#B7D2FF',
  300: '#85B5FF',
  400: '#4E8DFF',
  500: '#1E3A8A',
  600: '#1B347C',
  700: '#172E6D',
  800: '#14285E',
  900: '#172554'
}
Usage
Main buttons
Navbar
Headlines
Primary CTAs
Important links
Financial authority sections
GOLD ACCENT SYSTEM
Premium Identity Colors
brand: {
  50: '#FFF9E8',
  100: '#FDF1C7',
  200: '#F9E3A1',
  300: '#F3D06F',
  400: '#E7BF4A',
  500: '#D4AF37',
  600: '#BE982A',
  700: '#A07E22',
  800: '#80631B',
  900: '#5F4913'
}
Usage
Premium highlights
Badges
Featured cards
Accent borders
Hover accents
Important metrics
SUCCESS / MARKET GREEN
Financial Growth Colors
success: {
  50: '#ECFDF5',
  100: '#D1FAE5',
  200: '#A7F3D0',
  300: '#6EE7B7',
  400: '#34D399',
  500: '#10B981',
  600: '#059669',
  700: '#047857',
  800: '#065F46',
  900: '#064E3B'
}
Usage
Market gains
Positive stats
Success states
Demat sections
Trading indicators
BACKGROUND COLORS
background: {
  DEFAULT: '#F8FAFC',
  paper: '#FFFFFF',
  alt: '#F1F5F9',
  dark: '#0F172A'
}
Usage
DEFAULT → overall page background
paper → cards and containers
alt → alternate sections
dark → footer and dark sections
TEXT COLORS
text: {
  main: '#0F172A',
  secondary: '#334155',
  muted: '#64748B',
  soft: '#94A3B8',
  inverse: '#FFFFFF'
}
Usage
main → headings
secondary → body emphasis
muted → paragraphs
soft → captions
inverse → dark backgrounds
BORDER COLORS
border: {
  light: '#E2E8F0',
  DEFAULT: '#CBD5E1',
  dark: '#94A3B8'
}
Usage
Card borders
Divider lines
Input borders
Table outlines
STATUS COLORS
status: {
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#06B6D4'
}
PORTAL COLORS
portals: {
  nepse: '#2563EB',
  demat: '#10B981',
  midas: '#D4AF37'
}
Usage
Login portals
Portal-specific buttons
Portal indicators
26. TYPOGRAPHY SYSTEM
Recommended Fonts
Primary Font
Inter
Alternative Fonts
Geist
Manrope
Typography Philosophy

Typography should feel:

premium
clean
spacious
readable
professional
Heading Rules
H1
bold
tight tracking
large whitespace
strong hierarchy
H2
semi-bold
clear section separation
H3
medium emphasis
card headings
Body Text Rules
relaxed line-height
muted gray color
avoid dense paragraphs
use generous spacing
27. SPACING SYSTEM
Design Principle

Spacing creates premium perception.

Large clean spacing is mandatory.

Recommended Section Spacing
Desktop:
py-24 to py-32


Tablet:
py-20


Mobile:
py-14 to py-16
Container Widths
max-w-7xl
max-w-screen-xl
Card Padding
p-6
p-8

Avoid cramped layouts.

28. BORDER RADIUS SYSTEM
Recommended Radius
Buttons:
rounded-xl


Cards:
rounded-2xl


Inputs:
rounded-lg

Avoid overly rounded playful UI.

29. SHADOW SYSTEM
Shadow Philosophy

Use subtle elegant shadows.

Avoid heavy floating shadows.

Recommended Shadows
shadow-sm
shadow-md
shadow-lg

Use soft opacity.

30. BUTTON SYSTEM
Primary Button
Style
Navy background
White text
Medium shadow
Rounded-xl
Slight hover elevation
Usage
Open Account
Register
Start Trading
Primary CTAs
Secondary Button
Style
Outline variant
Navy border
Hover fill
Minimal design
Usage
Learn More
View Details
Secondary actions
Gold Accent Button
Style
Gold background
Dark text
Premium emphasis
Usage
Featured campaigns
Premium notices
Highlight sections
31. CARD SYSTEM
Card Style Rules

All cards should use:

white background
subtle border
soft shadow
spacious padding
hover elevation
clean typography
Hover Behavior

Good hover:

slight translate-y
subtle shadow increase
smooth transition

Avoid:

aggressive scaling
dramatic transforms
32. ICON SYSTEM
Icon Library

Use:

Lucide React
Icon Style
consistent stroke width
minimal style
outline-first approach

Avoid mixed icon styles.

33. MOTION SYSTEM
Motion Philosophy

Motion should feel:

subtle
smooth
premium
calm
Recommended Animations
Use
fade-up
stagger reveal
smooth hover transitions
counter animations
opacity transitions
Avoid
excessive parallax
constant movement
flashy motion
bouncing effects
34. RESPONSIVE DESIGN RULES
Mobile First

Always design mobile-first.

Layout Rules
Desktop
larger spacing
multi-column layouts
stronger visual hierarchy
Mobile
stacked sections
readable spacing
thumb-friendly buttons
simplified layouts
35. FINTECH UI RULES
IMPORTANT

The website must feel:

trustworthy
institutional
financially credible
stable
premium

NOT:

startup SaaS
gaming UI
crypto casino
flashy landing page
36. TAILWIND IMPLEMENTATION STRATEGY
Centralize Everything

All design tokens should come from:

tailwind.config.js
globals.css

Avoid inline custom styles whenever possible.

IMPORTANT RULE

Never use random colors.

Always use semantic design tokens.

Example:

bg-primary-500
text-text-main
border-border-light

NOT:

bg-blue-500
37. FINAL DESIGN OBJECTIVE

The final website should:

look premium
build financial trust
feel modern
remain minimal
support scalability
stay visually consistent
optimize readability
work perfectly on mobile
maintain institutional credibility