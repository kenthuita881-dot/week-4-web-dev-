# SpendWise Dashboard Shell

## What this is

The SpendWise Dashboard Shell is the visual foundation of my capstone project, a personal expense tracker. It is a clean, responsive dashboard layout built with plain HTML and modern CSS. This week is structure only, so all the content is realistic static data and there is no JavaScript functionality yet.

## How to run it

1. Keep `index.html` and `style.css` in the same folder.
2. Open `index.html` in any modern browser (or use the VS Code Live Server extension).

## Project files

| File | What it does |
| --- | --- |
| `index.html` | The page structure: sidebar, header and six category cards |
| `style.css` | All styling: theme variables, layout, cards, animations, responsive rules and dark theme |
| `README.md` | This document |

---

## What each part does

### 1. HTML structure (`index.html`)

The page is wrapped in a single `.app` container with three direct children, each with a clear job:

- **`<aside class="sidebar">`** is the navigation menu. It holds the SpendWise logo and a `<nav>` with a list of links: Dashboard (marked as the current page), Transactions, Budgets, Goals, Reports and Settings.
- **`<header class="header">`** shows the page title ("Dashboard"), a short subtitle for the month, the account balance and a user avatar.
- **`<main class="main">`** contains a "Spending by category" heading and a `<section class="cards">` holding six `<article class="card">` elements.

Each card has the same internal structure:

| Piece | Purpose |
| --- | --- |
| Icon | Emoji in a rounded box so each category is recognisable |
| Category name | Food, Transport, Rent, Entertainment, Savings or Utilities |
| Badge | Percentage of the budget used (or of the goal reached for Savings) |
| Amount | How much has been spent or saved this month |
| Meta text | The budget or goal the amount is measured against |
| Progress bar | A visual fill whose width is set by a `--pct` CSS variable |

The cards use `tabindex="0"` so keyboard users can Tab to them and see the focus animation. Decorative icons use `aria-hidden="true"`, and the nav has an `aria-label`, so the page works better with screen readers.

### 2. Theme with CSS custom properties

All colors live in one place, the `:root` selector, and the rest of the stylesheet uses them through `var(...)`:

| Variable | Role |
| --- | --- |
| `--brand` | Brand color (indigo): logo, active nav item, badges, focus ring |
| `--accent` | Accent color (teal): avatar, balance figure, end of progress bars |
| `--bg` | Page background |
| `--surface` | Background of the sidebar, header and cards |
| `--text` | Primary text |
| `--text-muted` | Secondary text |

There are also helper variables for borders, shadows, border radius and animation speed, so changing the look of the whole app means editing a few lines.

### 3. Layout with CSS Grid and Flexbox

- **CSS Grid (page level):** `.app` uses `grid-template-areas` to place the sidebar on the left (240px wide), with the header above the main area on the right. The card area uses `repeat(auto-fill, minmax(240px, 1fr))`, so the cards fill the available width and wrap automatically.
- **Flexbox (inside components):**
  - the **sidebar** stacks the logo and menu in a column, and each nav item lines up its icon and label in a row
  - the **header** pushes the title to the left and the balance and avatar to the right
  - each **card** stacks its content vertically, and the top row of each card aligns the icon, name and badge
- **No absolute positioning** is used anywhere for the page layout.

### 4. Responsive design

A media query at `max-width: 767px` (that is, below 768px) changes the layout:

- the page grid becomes a single column (sidebar on top, then header, then content)
- the sidebar menu turns into a horizontal, wrapping row of links
- the header content stacks vertically
- the cards stack one per row

To verify this, open DevTools (F12), toggle the Device Toolbar (Ctrl+Shift+M, or Cmd+Shift+M on Mac) and test widths below and above 768px, such as 375px and 1024px.

### 5. Card micro-interactions

Cards respond to both **hover** and **keyboard focus** (`:focus-visible`):

- they lift up slightly with `transform: translateY(-4px)`
- they gain a stronger `box-shadow`
- the transition lasts **200ms**, within the 250ms limit
- on focus, a visible outline is added for accessibility

For users who have reduced motion turned on in their system settings, the animation is disabled with `prefers-reduced-motion`.

### 6. Stretch goal: dark theme

The dark theme is implemented by overriding **only the `:root` variables** inside `@media (prefers-color-scheme: dark)`. No component rules are repeated, which works because every color in the stylesheet comes from a variable. The page switches automatically with the device's light or dark setting.

To test it, open DevTools, go to Rendering, and use "Emulate CSS media feature prefers-color-scheme".

---

## Requirements checklist

- [x] Sidebar / navigation menu
- [x] Header
- [x] Six category cards with realistic static data
- [x] CSS Grid for the overall layout
- [x] Flexbox for the header, sidebar items and card content
- [x] No absolute positioning for layout
- [x] Theme variables on `:root` (brand, accent, surface, primary text, secondary text)
- [x] Single-column layout below 768px
- [x] Hover and focus animations of 250ms or less using `transform` and `box-shadow`
- [x] Stretch goal: dark theme via `prefers-color-scheme`

## Possible next steps

- Add JavaScript so the cards update from real expense data
- Build the Transactions and Budgets pages linked from the sidebar
- Add charts for monthly spending trends