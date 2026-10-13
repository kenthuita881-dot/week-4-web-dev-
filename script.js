// =====================================================
// SpendWise - JavaScript Foundation
// Collects budget + expense data, calculates the
// remaining balance and logs a clear report to the console.
// =====================================================

console.log("SpendWise script loaded successfully.");

// ---------- 1. Application data (variables) ----------
const APP_NAME = "SpendWise";
const CURRENCY = "$";

// Budget-related data
let monthlyBudget = 0;

// Expense-related data (one entry per dashboard category)
let expenses = {
  Food: 0,
  Transport: 0,
  Rent: 0,
  Entertainment: 0,
  Savings: 0,
  Utilities: 0,
};

// ---------- 2. Reusable functions ----------

/**
 * Ask the user for a number with prompt() and keep asking
 * until the input is a valid, non-negative number.
 * Returns null if the user presses Cancel.
 */
function getNumberInput(message) {
  while (true) {
    const answer = prompt(message);

    if (answer === null) {
      return null; // user cancelled
    }

    const value = Number(answer.trim());

    if (answer.trim() !== "" && !Number.isNaN(value) && value >= 0) {
      return value;
    }

    alert("Please enter a valid number (0 or greater).");
  }
}

/** Format a number as money, e.g. 1200 -> "$1,200.00" */
function formatCurrency(amount) {
  return CURRENCY + amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Add up every expense in the expenses object. */
function calculateTotalExpenses(expenseData) {
  let total = 0;
  for (const category in expenseData) {
    total += expenseData[category];
  }
  return total;
}

/** Remaining balance = budget - total expenses (can be negative). */
function calculateRemainingBalance(budget, totalExpenses) {
  return budget - totalExpenses;
}

/** Percentage of the budget that has been used (0 if no budget). */
function calculatePercentUsed(budget, totalExpenses) {
  if (budget === 0) {
    return 0;
  }
  return (totalExpenses / budget) * 100;
}

/** Return a short status message based on the remaining balance. */
function getBudgetStatus(remaining) {
  if (remaining < 0) {
    return "OVER BUDGET - you have spent more than planned.";
  }
  if (remaining === 0) {
    return "On the limit - the whole budget has been used.";
  }
  return "Within budget - keep it up!";
}

/** Collect the monthly budget and each category's spending. */
function collectUserInput() {
  const budgetInput = getNumberInput("Enter your total monthly budget (e.g. 3000):");
  monthlyBudget = budgetInput === null ? 0 : budgetInput;

  for (const category in expenses) {
    const amount = getNumberInput(`How much did you spend on ${category} this month?`);
    expenses[category] = amount === null ? 0 : amount;
  }
}

/** Print a clearly labelled report to the browser console. */
function displayReport() {
  const totalExpenses = calculateTotalExpenses(expenses);
  const remaining = calculateRemainingBalance(monthlyBudget, totalExpenses);
  const percentUsed = calculatePercentUsed(monthlyBudget, totalExpenses);

  console.log("=================================");
  console.log(`${APP_NAME} - Monthly Budget Report`);
  console.log("=================================");
  console.log("Monthly budget:     " + formatCurrency(monthlyBudget));

  console.log("Expenses by category:");
  for (const category in expenses) {
    console.log(`  - ${category}: ${formatCurrency(expenses[category])}`);
  }

  console.log("Total expenses:     " + formatCurrency(totalExpenses));
  console.log("Remaining balance:  " + formatCurrency(remaining));
  console.log("Budget used:        " + percentUsed.toFixed(1) + "%");
  console.log("Status:             " + getBudgetStatus(remaining));
}

// ---------- 3. Run the app ----------
// A short delay lets the dashboard render before the prompts appear.
setTimeout(function () {
  collectUserInput();
  displayReport();
}, 300);