// =====================================================
// SpendWise - Interactive Budgeting (JavaScript)
//
// Flow:  user action (form / button / card)  ->  event listener
//        -> update data (array)  ->  loops + conditionals
//        -> render to the page (DOM)
// =====================================================

console.log("SpendWise script loaded successfully.");

// ---------- 1. Application data ----------
const APP_NAME = "SpendWise";
const CURRENCY = "$";
const WARNING_THRESHOLD = 80; // % of budget at which we warn the user

// Dashboard categories. "goal" categories (Savings) are targets to reach,
// not limits to stay under.
const categories = [
  { name: "Food",          icon: "🍔", budget: 600,  type: "limit" },
  { name: "Transport",     icon: "🚌", budget: 200,  type: "limit" },
  { name: "Rent",          icon: "🏠", budget: 1200, type: "limit" },
  { name: "Entertainment", icon: "🎬", budget: 150,  type: "limit" },
  { name: "Savings",       icon: "💰", budget: 750,  type: "goal"  },
  { name: "Utilities",     icon: "💡", budget: 200,  type: "limit" },
];

let monthlyBudget = 3100;

// Array of expense records (objects)
let expenses = [
  { id: 1, description: "Groceries",        amount: 250,   category: "Food" },
  { id: 2, description: "Restaurants",      amount: 182,   category: "Food" },
  { id: 3, description: "Bus pass",         amount: 90,    category: "Transport" },
  { id: 4, description: "October rent",     amount: 1200,  category: "Rent" },
  { id: 5, description: "Cinema and games", amount: 132,   category: "Entertainment" },
  { id: 6, description: "Savings deposit",  amount: 450,   category: "Savings" },
  { id: 7, description: "Electricity bill", amount: 108.5, category: "Utilities" },
];
let nextId = 8;
let activeFilter = "All";

// ---------- 2. DOM references ----------
const els = {
  budgetForm: document.getElementById("budget-form"),
  budgetInput: document.getElementById("budget-input"),
  statBudget: document.getElementById("stat-budget"),
  statSpent: document.getElementById("stat-spent"),
  statRemaining: document.getElementById("stat-remaining"),
  statPercent: document.getElementById("stat-percent"),
  headerRemaining: document.getElementById("header-remaining"),
  statusBanner: document.getElementById("status-banner"),
  cards: document.getElementById("cards"),
  expenseForm: document.getElementById("expense-form"),
  description: document.getElementById("expense-description"),
  amount: document.getElementById("expense-amount"),
  category: document.getElementById("expense-category"),
  formMessage: document.getElementById("form-message"),
  filter: document.getElementById("filter-category"),
  list: document.getElementById("expense-list"),
  emptyState: document.getElementById("empty-state"),
};

// ---------- 3. Calculation functions (loops) ----------

function formatCurrency(amount) {
  return CURRENCY + amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Loop through every record and add up the amounts. */
function calculateTotalExpenses(list) {
  let total = 0;
  for (const expense of list) {
    total += expense.amount;
  }
  return total;
}

/** Loop through the records and add up only one category. */
function calculateCategoryTotal(list, categoryName) {
  let total = 0;
  for (const expense of list) {
    if (expense.category === categoryName) {
      total += expense.amount;
    }
  }
  return total;
}

function calculateRemainingBalance(budget, totalExpenses) {
  return budget - totalExpenses;
}

function calculatePercentUsed(spent, budget) {
  if (budget <= 0) {
    return 0;
  }
  return (spent / budget) * 100;
}

// ---------- 4. Decision-making functions (conditionals) ----------

/** Overall budget status -> { level, message } */
function getBudgetStatus(percentUsed, remaining) {
  if (remaining < 0) {
    return {
      level: "over",
      message: `Over budget by ${formatCurrency(Math.abs(remaining))}. Time to cut back!`,
    };
  } else if (percentUsed >= WARNING_THRESHOLD) {
    return {
      level: "warning",
      message: `Careful: you have used ${percentUsed.toFixed(0)}% of your budget. ${formatCurrency(remaining)} left.`,
    };
  } else {
    return {
      level: "ok",
      message: `You are on track. ${formatCurrency(remaining)} left to spend.`,
    };
  }
}

/** Status for one category card -> { level, label } */
function getCategoryStatus(category, spent) {
  const percent = calculatePercentUsed(spent, category.budget);

  if (category.type === "goal") {
    if (percent >= 100) {
      return { level: "ok", label: "Goal reached" };
    }
    return { level: "ok", label: `${percent.toFixed(0)}% of goal` };
  }

  if (spent > category.budget) {
    return { level: "over", label: "Over budget" };
  } else if (percent >= WARNING_THRESHOLD) {
    return { level: "warning", label: `${percent.toFixed(0)}% used` };
  }
  return { level: "ok", label: `${percent.toFixed(0)}% used` };
}

// ---------- 5. Rendering (DOM manipulation) ----------

/** Small helper to create an element with a class and text. */
function createEl(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function renderSummary() {
  const total = calculateTotalExpenses(expenses);
  const remaining = calculateRemainingBalance(monthlyBudget, total);
  const percent = calculatePercentUsed(total, monthlyBudget);
  const status = getBudgetStatus(percent, remaining);

  els.statBudget.textContent = formatCurrency(monthlyBudget);
  els.statSpent.textContent = formatCurrency(total);
  els.statRemaining.textContent = formatCurrency(remaining);
  els.statPercent.textContent = percent.toFixed(1) + "%";
  els.headerRemaining.textContent = formatCurrency(remaining);

  els.statRemaining.className = "stat-value " + (remaining < 0 ? "negative" : "");
  els.statusBanner.className = "status-banner " + status.level;
  els.statusBanner.textContent = status.message;

  console.log(`${APP_NAME} | Budget: ${formatCurrency(monthlyBudget)} | Spent: ${formatCurrency(total)} | Remaining: ${formatCurrency(remaining)} | ${status.level.toUpperCase()}`);
}

function renderCards() {
  els.cards.replaceChildren();

  for (const category of categories) {
    const spent = calculateCategoryTotal(expenses, category.name);
    const status = getCategoryStatus(category, spent);
    const percent = calculatePercentUsed(spent, category.budget);

    const card = createEl("article", "card " + status.level);
    card.tabIndex = 0;
    card.dataset.category = category.name;

    const top = createEl("div", "card-top");
    const icon = createEl("span", "card-icon", category.icon);
    icon.setAttribute("aria-hidden", "true");
    top.append(icon, createEl("h3", "", category.name), createEl("span", "badge", status.label));

    const bar = createEl("div", "bar");
    const fill = document.createElement("span");
    fill.style.setProperty("--pct", Math.min(percent, 100) + "%");
    bar.appendChild(fill);

    const metaText = category.type === "goal"
      ? `of ${formatCurrency(category.budget)} monthly goal`
      : `of ${formatCurrency(category.budget)} budget`;

    card.append(top, createEl("p", "amount", formatCurrency(spent)), createEl("p", "meta", metaText), bar);
    els.cards.appendChild(card);
  }
}

function renderExpenseList() {
  els.list.replaceChildren();
  let shown = 0;

  // Loop backwards so the newest expense appears first
  for (let i = expenses.length - 1; i >= 0; i--) {
    const expense = expenses[i];

    if (activeFilter !== "All" && expense.category !== activeFilter) {
      continue;
    }

    const item = createEl("li", "expense-item");

    const info = createEl("div", "expense-info");
    info.append(
      createEl("span", "expense-name", expense.description),
      createEl("span", "expense-tag", expense.category)
    );

    const deleteBtn = createEl("button", "delete-btn", "Delete");
    deleteBtn.type = "button";
    deleteBtn.dataset.id = expense.id;
    deleteBtn.setAttribute("aria-label", `Delete ${expense.description}`);

    item.append(info, createEl("span", "expense-amount", formatCurrency(expense.amount)), deleteBtn);
    els.list.appendChild(item);
    shown++;
  }

  els.emptyState.hidden = shown > 0;
}

/** Re-draw everything that depends on the data. */
function renderAll() {
  renderSummary();
  renderCards();
  renderExpenseList();
}

/** Fill both <select> elements from the categories array. */
function populateCategorySelects() {
  els.filter.appendChild(new Option("All categories", "All"));

  for (const category of categories) {
    els.category.appendChild(new Option(category.name, category.name));
    els.filter.appendChild(new Option(category.name, category.name));
  }
}

function showFormMessage(text, isError) {
  els.formMessage.textContent = text;
  els.formMessage.className = "form-message " + (isError ? "error" : "success");
}

// ---------- 6. Event listeners (user interaction) ----------

// Add an expense
els.expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const description = els.description.value.trim();
  const amount = Number(els.amount.value);
  const category = els.category.value;

  if (description === "") {
    showFormMessage("Please enter a description.", true);
    els.description.focus();
    return;
  }
  if (els.amount.value === "" || Number.isNaN(amount) || amount <= 0) {
    showFormMessage("Please enter an amount greater than 0.", true);
    els.amount.focus();
    return;
  }

  expenses.push({ id: nextId++, description, amount, category });
  els.expenseForm.reset();
  els.description.focus();
  showFormMessage(`Added ${formatCurrency(amount)} to ${category}.`, false);
  renderAll();
});

// Update the monthly budget
els.budgetForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newBudget = Number(els.budgetInput.value);
  if (els.budgetInput.value === "" || Number.isNaN(newBudget) || newBudget <= 0) {
    return;
  }

  monthlyBudget = newBudget;
  els.budgetInput.value = "";
  renderAll();
});

// Delete an expense (one listener for the whole list: event delegation)
els.list.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-id]");
  if (!button) {
    return;
  }

  const id = Number(button.dataset.id);
  for (let i = 0; i < expenses.length; i++) {
    if (expenses[i].id === id) {
      expenses.splice(i, 1);
      break;
    }
  }
  renderAll();
});

// Filter the expense list
els.filter.addEventListener("change", function () {
  activeFilter = els.filter.value;
  renderExpenseList();
});

// Clicking (or pressing Enter / Space on) a card filters the list to that category
function filterByCard(event) {
  const card = event.target.closest(".card");
  if (!card) {
    return;
  }
  if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") {
    return;
  }
  event.preventDefault();

  activeFilter = card.dataset.category;
  els.filter.value = activeFilter;
  renderExpenseList();
}
els.cards.addEventListener("click", filterByCard);
els.cards.addEventListener("keydown", filterByCard);

// ---------- 7. Start the app ----------
populateCategorySelects();
renderAll();