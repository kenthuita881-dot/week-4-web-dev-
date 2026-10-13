# SpendWise

SpendWise is a personal budgeting dashboard that I'm building step by step for my capstone project. It started as a static CSS layout and now uses JavaScript to store expenses, make decisions about spending and update the page as the user interacts with it.

## How to run it

1. Keep `index.html`, `style.css` and `script.js` in the same folder.
2. Open `index.html` in any modern browser (or use the VS Code Live Server extension).
3. Open the console (F12, then the Console tab) to see the status log that is printed after every change.

## Project files

| File | What it does |
| --- | --- |
| `index.html` | Page structure: sidebar, header, summary, category cards, expense form and expense list |
| `style.css` | Theme variables, Grid and Flexbox layout, card animations, forms, status colors, responsive and dark theme |
| `script.js` | Data, calculations, decision making and DOM updates |
| `README.md` | This document |

---

## How it works: from user action to page update

1. The user does something (submits a form, clicks Delete, picks a filter, clicks a card).
2. An **event listener** in `script.js` runs.
3. The listener updates the **data** (the `expenses` array or `monthlyBudget`).
4. **Loops** recalculate totals and **conditionals** decide the status.
5. **DOM functions** redraw the summary, the cards and the expense list.

---

## JavaScript concepts and where they are used

### Decision making (conditionals)
- `getBudgetStatus()` uses `if / else if / else` to give feedback on the whole budget:
  - **over budget** when the remaining balance is below 0
  - **warning** when 80% or more of the budget is used
  - **on track** otherwise
- `getCategoryStatus()` does the same for each card. Savings is treated as a goal, so reaching it shows "Goal reached" instead of a warning.
- The expense form checks the input (empty description, amount of 0 or less) and shows an error message instead of saving it.

### Multiple records (arrays)
- `expenses` is an array of objects: `{ id, description, amount, category }`.
- `categories` is an array of objects that describes the six dashboard cards (name, icon, budget, type).
- `push()` adds a new expense and `splice()` removes one.

### Loops
- `for...of` in `calculateTotalExpenses()` and `calculateCategoryTotal()` adds up the records.
- `for...of` over `categories` builds the cards and the dropdown options.
- A backwards `for` loop in `renderExpenseList()` shows the newest expense first and uses `continue` to skip records that don't match the filter.
- A `for` loop finds the expense to delete by its `id`.

### Dynamic dashboard (DOM manipulation)
- `renderSummary()` updates the budget, spent, remaining and percentage values, the header balance and the colored status banner.
- `renderCards()` creates the six category cards with `createElement`, sets each progress bar through a CSS variable and adds a status class (`ok`, `warning` or `over`).
- `renderExpenseList()` rebuilds the list and shows an empty message when nothing matches.
- Text is added with `textContent` (not `innerHTML`), so what the user types can't inject HTML.

### User interactions (event listeners)
| Event | What happens |
| --- | --- |
| Submit the **Add expense** form | Validates, adds the record to the array and re-renders everything |
| Submit the **Update budget** form | Changes `monthlyBudget` and re-renders |
| Click **Delete** on an expense | Removes the record (one listener on the list handles every button) |
| Change the **Show** dropdown | Filters the expense list by category |
| Click a category card (or press Enter / Space on it) | Filters the list to that category |

---

## CSS features (from earlier weeks)

- **CSS Grid** for the page layout, the summary tiles, the card grid and the tracker area. **Flexbox** for the header, sidebar items, card contents, forms and expense rows. No absolute positioning.
- **Custom properties** on `:root` for the brand, accent, surface, primary text and secondary text colors, plus `--ok`, `--warn` and `--danger` for statuses.
- **Responsive:** below 768px the layout becomes a single column (test with the DevTools Device Toolbar, Ctrl+Shift+M).
- **Card micro-interactions:** a 200ms `transform` and `box-shadow` animation on hover and keyboard focus.
- **Dark theme:** `prefers-color-scheme: dark` overrides only the `:root` variables.

---

## Try it out

1. Add an expense, for example "Lunch", 25, Food. The Food card, the summary and the list all update.
2. Raise Entertainment spending above 150 and watch its card turn red.
3. Lower the monthly budget (for example to 2000) to trigger the "over budget" message.
4. Click a card to filter the list, and delete an expense with the Delete button.

## Notes and limitations

- Data lives in JavaScript variables, so it resets when the page is refreshed. Saving it (for example with `localStorage`) is a good next step.
- Savings deposits count as money spent in the totals, because they leave the budget each month.

## Possible next steps

- Save expenses with `localStorage`
- Add an edit option for existing expenses
- Add charts for monthly trends