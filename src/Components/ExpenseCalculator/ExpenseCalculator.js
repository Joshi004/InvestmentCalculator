import React, { Component } from 'react';
import { Form, Input, Button, Segment, Header, Grid } from 'semantic-ui-react';
import { getMonthlyCAGR, calculateRemainingAmount } from './ExpenseCalculatorHelper'; // Import helper functions
import InvestmentChart from '../Investmentchart/InvestmentChart'; // Chart component for visualizing remaining money
import Slider from 'rc-slider'; // Import rc-slider
import 'rc-slider/assets/index.css'; // Import rc-slider styles
import './ExpenseCalculator.scss'; // Import your custom styles

class ExpenseCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialAmount: 10000000, // Default value of Total Initial Amount (1 crore)
      monthlyExpense: 50000, // Monthly expense with default value
      expenseIncrement: 10, // Default value for Expense Increment Per Year (%)
      totalYears: 30, // Default value for Total Expenditure Years
      cagr: 12, // Default value for Annual CAGR (%)
      remainingAmount: 0,
      monthsUntilZero: 0,
      chartData: null, // For storing chart data
    };
  }

  // Handle input changes for non-slider fields
  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value !== '' ? parseFloat(value) : '' });
  };

  // Handle slider change for Monthly Expense and trigger chart update
  handleSliderChange = (value) => {
    this.setState({ monthlyExpense: value }, this.calculateResults); // Call calculateResults after updating state
  };

  // Handle slider change for Initial Amount and trigger chart update
  handleInitialAmountSliderChange = (value) => {
    this.setState({ initialAmount: value }, this.calculateResults); // Update the chart when the slider changes
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

        <Grid className="form-container">
          <Grid.Row>
            {/* Left Column: Input Form */}
            <Grid.Column width={16} mobile={16} tablet={8} computer={3}>
              <Form>
                <Form.Field>
                  <label>Total Initial Amount: ₹{(initialAmount / 10000000).toLocaleString('en-IN')} Crore</label>
                  <Slider
                    value={initialAmount}
                    min={10000000}  // 1 crore
                    max={1000000000} // 100 crores
                    step={10000000}  // 1 crore step
                    onChange={this.handleInitialAmountSliderChange} // Update chart when slider changes
                  />
                </Form.Field>

                <Form.Field>
                  <label>Expense Per Month: ₹{monthlyExpense.toLocaleString('en-IN')}</label>
                  <Slider
                    value={monthlyExpense}
                    min={50000}
                    max={1000000}
                    step={10000}
                    onChange={this.handleSliderChange} // Update chart when slider changes
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
            <Grid.Column width={16} mobile={16} tablet={8} computer={13}>
              {chartData && <InvestmentChart chartData={chartData} />}
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
      </Segment>
    );
  }
}

export default ExpenseCalculator;
