// Convert annual CAGR to monthly rate
export const getMonthlyCAGR = (cagr) => {
  return Math.pow(1 + cagr / 100, 1 / 12) - 1;
};

// Calculate how long the initial amount will last and track withdrawals and additions
export const calculateRemainingAmount = (initialAmount, monthlyExpense, expenseIncrement, years, monthlyCAGR) => {
  let remainingAmount = initialAmount;
  let months = years * 12;
  let expense = monthlyExpense;
  const remainingAmounts = [];
  const withdrawnAmounts = [];
  const addedAmounts = [];

  for (let month = 1; month <= months; month++) {
    // Track how much is added due to CAGR
    const added = remainingAmount * monthlyCAGR;
    remainingAmount = remainingAmount + added; // Increase the money by the monthly CAGR

    // Track the added amount
    addedAmounts.push(added);

    // Deduct the monthly expense
    remainingAmount -= expense;

    // Track the withdrawal
    withdrawnAmounts.push(expense);

    // Save remaining amount for graph
    remainingAmounts.push(remainingAmount > 0 ? remainingAmount : 0);

    // If remaining amount is zero or below, return the month it happens
    if (remainingAmount <= 0) {
      return { remainingAmount: 0, monthsUntilZero: month, remainingAmounts, withdrawnAmounts, addedAmounts };
    }

    // Increase the expense yearly
    if (month % 12 === 0) {
      expense *= (1 + expenseIncrement / 100);
    }
  }

  return { remainingAmount, monthsUntilZero: months, remainingAmounts, withdrawnAmounts, addedAmounts };
};


