import React, { Component } from 'react';
import { Form, Input, Button, Segment, Header, Grid } from 'semantic-ui-react';
import { getMonthlyCAGR, calculateRemainingAmount } from './ExpenseCalculatorHelper'; // Import helper functions
import InvestmentChart from '../Investmentchart/InvestmentChart'; // Chart component for visualizing remaining money
import './ExpenseCalculator.scss'; // Import your custom styles
import Slider from 'rc-slider'; // Import rc-slider
import 'rc-slider/assets/index.css'; // Import rc-slider styles

class ExpenseCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialAmount: 10000000, // Total initial amount (default 1 crore)
      formattedInitialAmount: '', // Formatted initial amount (with commas)
      monthlyExpense: 50000, // Monthly expense with default value
      expenseIncrement: 10, // Expense increment per year (default)
      totalYears: 30, // Total expenditure years (default)
      cagr: 12, // Annual CAGR (default)
      remainingAmount: 0,
      monthsUntilZero: 0,
      chartData: null, // For storing chart data
    };
  }

  // Handle input changes for other fields
  handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/,/g, '');

    this.setState({ [name]: value !== '' ? parseFloat(numericValue) : '' });
  };

  // Function to format numbers with commas
  formatNumber = (value) => {
    if (!value) return '';
    return Number(value).toLocaleString('en-IN');
  };

  // Handle slider change for Monthly Expense and Total Initial Amount and trigger chart update
  handleSliderChange = (name, value) => {
    this.setState({ [name]: value }, this.calculateResults); // Update state and recalculate results
  };

  // Calculate the remaining amount and display results
  calculateResults = () => {
    const { initialAmount, monthlyExpense, expenseIncrement, totalYears, cagr } = this.state;

    // Get monthly CAGR from annual CAGR
    const monthlyCAGR = getMonthlyCAGR(cagr);

    // Calculate remaining amount and withdrawals over time
    const { remainingAmount, monthsUntilZero, remainingAmounts, withdrawnAmounts, addedAmounts } = calculateRemainingAmount(
      initialAmount, monthlyExpense, expenseIncrement, totalYears, monthlyCAGR
    );

    // Generate labels in "X years Y months" format
    const labels = Array.from({ length: totalYears * 12 }, (_, i) => {
      const year = Math.floor(i / 12);
      const month = i % 12 + 1;
      return `${year} year${year === 1 ? '' : 's'} ${month} month${month === 1 ? '' : 's'}`;
    });

    // Prepare chart data
    const chartData = {
      labels, // Use the new labels for the X-axis
      datasets: [
        {
          label: 'Remaining Amount',
          data: remainingAmounts,
          borderColor: 'blue',
          yAxisID: 'y-axis-1',
          fill: false,
        },
        {
          label: 'Withdrawn Amount',
          data: withdrawnAmounts,
          borderColor: 'red',
          yAxisID: 'y-axis-2',
          fill: false,
        },
        {
          label: 'Added Amount (CAGR)',
          data: addedAmounts,
          borderColor: 'green',
          yAxisID: 'y-axis-2',
          fill: false,
        }
      ]
    };

    // Set calculated values in state
    this.setState({
      remainingAmount,
      monthsUntilZero,
      chartData
    });
  };

  render() {
    const { initialAmount, monthlyExpense, expenseIncrement, totalYears, cagr, remainingAmount, monthsUntilZero, chartData } = this.state;

    return (
      <Segment className="expense-calculator-container" padded>
        <Header as="h2" textAlign="center">Retirement Expense Calculator</Header>

        <Grid stackable doubling> {/* Use stackable and doubling for responsive design */}
          <Grid.Row columns={2}> {/* Ensure two columns */}
            
            {/* Left Column: Input Form */}
            <Grid.Column width={4} tablet={6} mobile={16}> {/* Adjust width for responsiveness */}
              <Form>
                <Form.Field>
                  <label>Total Initial Amount: ₹{initialAmount.toLocaleString('en-IN')}</label>
                  <Slider
                    value={initialAmount}
                    min={10000000} // 1 crore
                    max={1000000000} // 100 crore
                    step={1000000} // Step of 1 crore
                    onChange={(value) => this.handleSliderChange('initialAmount', value)} // Update chart when slider changes
                  />
                </Form.Field>

                <Form.Field>
                  <label>Expense Per Month: ₹{monthlyExpense.toLocaleString('en-IN')}</label>
                  <Slider
                    value={monthlyExpense}
                    min={50000}
                    max={1000000}
                    step={10000}
                    onChange={(value) => this.handleSliderChange('monthlyExpense', value)} // Update chart when slider changes
                  />
                </Form.Field>

                <Form.Field>
                  <label>Expense Increment Per Year (%)</label>
                  <Input
                    placeholder="Enter Yearly Expense Increment"
                    type="number"
                    name="expenseIncrement"
                    value={expenseIncrement}
                    onChange={this.handleInputChange}
                    fluid
                  />
                </Form.Field>
                <Form.Field>
                  <label>Total Expenditure Years</label>
                  <Input
                    placeholder="Enter Total Expenditure Years"
                    type="number"
                    name="totalYears"
                    value={totalYears}
                    onChange={this.handleInputChange}
                    fluid
                  />
                </Form.Field>
                <Form.Field>
                  <label>Annual CAGR (%)</label>
                  <Input
                    placeholder="Enter Annual CAGR"
                    type="number"
                    name="cagr"
                    value={cagr}
                    onChange={this.handleInputChange}
                    fluid
                  />
                </Form.Field>
                <Button primary fluid onClick={this.calculateResults}>
                  Calculate
                </Button>
              </Form>
            </Grid.Column>

            {/* Right Column: Output Results */}
            <Grid.Column width={12} tablet={10} mobile={16}>
              <Segment className="result-box">
                <Header as="h3">Expense Summary</Header>
                <p>
                  <strong>Amount Remaining After {totalYears} Years:</strong> ₹
                  {Math.round(remainingAmount).toLocaleString('en-IN')}
                </p>
                {remainingAmount <= 0 && (
                  <p>
                    <strong>Amount Exhausted In:</strong> {Math.floor(monthsUntilZero / 12)} years and {monthsUntilZero % 12} months
                  </p>
                )}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {/* Conditionally render the chart only on tablet and larger devices */}
        <div className="chart-container">
          {chartData && <InvestmentChart chartData={chartData} />}
        </div>
      </Segment>
    );
  }
}

export default ExpenseCalculator;
