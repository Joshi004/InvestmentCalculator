// Format a number as per Indian numeric system
export const formatNumber = (value) => {
    if (!value) return '';
    return Number(value).toLocaleString('en-IN');
  };
  
  // Helper function to convert numbers to words in the English numeric system
  export const convertNumberToWords = (num) => {
    const a = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
      'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];
    const b = [
      '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
    ];
    
    const units = ['', 'thousand', 'million', 'billion'];
  
    if (num === 0) return 'zero';
  
    let str = '';
    let unitIndex = 0;
  
    while (num > 0) {
      let part = num % 1000;
      num = Math.floor(num / 1000);
  
      if (part > 0) {
        let hundred = Math.floor(part / 100);
        let remainder = part % 100;
        let words = '';
  
        if (hundred > 0) {
          words += `${a[hundred]} hundred `;
        }
        if (remainder > 0) {
          if (remainder < 20) {
            words += `${a[remainder]} `;
          } else {
            words += `${b[Math.floor(remainder / 10)]} ${a[remainder % 10]} `;
          }
        }
  
        str = `${words}${units[unitIndex]} ${str}`;
      }
  
      unitIndex++;
    }
  
    return str.trim();
  };
  
  // Function to calculate SIP maturity using recursive logic
  export const calculateSIPMaturity = (totalSofar, monthlyContribution, yearlyIncrementRate, rateOfInterest, time, investedValues = [], returnValues = [], totalValues = [], initialTime = time) => {
    const rMonthly = rateOfInterest / 100 / 12; // Monthly interest rate
    const iYearly = yearlyIncrementRate / 100; // Yearly increment rate
  
    // Calculate total value after this month
    totalSofar = (totalSofar + monthlyContribution) * (1 + rMonthly);
  
    // Calculate yearly data to store
    const invested = investedValues.length > 0 ? investedValues[investedValues.length - 1] + monthlyContribution : monthlyContribution;
    const totalReturn = totalSofar - invested;
    investedValues.push(Math.round(invested));
    returnValues.push(Math.round(totalReturn));
    totalValues.push(Math.round(totalSofar));
  
    // Base case: Stop when time (months) reaches 0
    if (time <= 0) {
      return {
        investedValues,
        returnValues,
        totalValues
      };
    } else {
      // Decrease time (months)
      time -= 1;
  
      // Increment monthly contribution at the start of every new year (when months % 12 === 0)
      if (time % 12 === 0 && time !== initialTime) {
        monthlyContribution = monthlyContribution * (1 + iYearly);
      }
  
      // Recursive call to calculate next month
      return calculateSIPMaturity(totalSofar, monthlyContribution, yearlyIncrementRate, rateOfInterest, time, investedValues, returnValues, totalValues, initialTime);
    }
  };
  
  // Function to calculate lump sum maturity using annual compounding
  export const calculateLumpSumMaturity = (initialAmount, rateOfInterest, time) => {
    const r = rateOfInterest / 100; // Annual interest rate in decimal
    // Lump sum formula with annual compounding
    return initialAmount * Math.pow(1 + r, time);
  };
  
  // Helper function to calculate results
  export const calculateResults = (initialAmount, rateOfInterest, time, monthlyInvestment, yearlyIncrement) => {
    // Handle empty or invalid inputs by treating them as 0
    const lumpSumInvestment = initialAmount ? initialAmount : 0; // Lump sum investment
    const monthlyContribution = monthlyInvestment ? monthlyInvestment : 0; // Monthly SIP contribution
    const yearlyIncrementRate = yearlyIncrement ? yearlyIncrement : 0; // Yearly increment percentage
  
    if (rateOfInterest && time) {
      // Start calculating SIP maturity using the recursive function from the helper
      const { investedValues, returnValues, totalValues } = calculateSIPMaturity(
        lumpSumInvestment, monthlyContribution, yearlyIncrementRate, rateOfInterest, time * 12
      );
  
      // Prepare chart data
      const chartData = {
        labels: Array.from({ length: time }, (_, i) => `Year ${i + 1}`),
        datasets: [
          {
            label: 'Total Amount Invested',
            data: investedValues.filter((_, index) => (index + 1) % 12 === 0), // Show yearly data
            borderColor: 'blue',
            fill: false,
          },
          {
            label: 'Total Returns Accumulated',
            data: returnValues.filter((_, index) => (index + 1) % 12 === 0), // Show yearly data
            borderColor: 'green',
            fill: false,
          },
          {
            label: 'Total Amount (Invested + Returns)',
            data: totalValues.filter((_, index) => (index + 1) % 12 === 0), // Show yearly data
            borderColor: 'red',
            fill: false,
          }
        ]
      };
  
      // Calculate total amount at maturity
      const totalInvested = investedValues[investedValues.length - 1];
      const totalReturn = returnValues[returnValues.length - 1];
      const totalAmount = totalValues[totalValues.length - 1];
  
      // Return the calculated values
      return {
        totalInvested,
        totalReturn,
        totalAmount,
        chartData
      };
    }
  
    // Return default values in case of invalid input
    return {
      totalInvested: 0,
      totalReturn: 0,
      totalAmount: 0,
      chartData: null
    };
  };
  