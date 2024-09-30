import React, { Component } from 'react';
import { Form, Input, Button, Segment, Header, Grid } from 'semantic-ui-react';
import InvestmentChart from '../Investmentchart/InvestmentChart'; // Import the new chart component
import { formatNumber, calculateResults, convertNumberToWords } from './InvestmentCalculatorHelper'; // Import helper functions
import './InvestmentCalculator.scss'; // Import your custom styles

class InvestmentCalculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialAmount: '', // Initial lump sum investment
      formattedInitialAmount: '', // Formatted initial amount (with commas)
      rateOfInterest: '', // Annual rate of interest
      time: '', // Time in years
      monthlyInvestment: '', // Monthly SIP contribution
      formattedMonthlyInvestment: '', // Formatted monthly SIP (with commas)
      yearlyIncrement: '', // Yearly increment percentage
      totalInvested: 0,
      totalReturn: 0,
      totalAmount: 0,
      chartData: null, // For storing chart data
      totalAmountInWords: '', // To store the total amount in words
    };
  }

  // Handle input changes and strip commas from the input for calculations
  handleInputChange = (e) => {
    const { name, value } = e.target;

    // Remove commas and parse the number for internal calculations
    const numericValue = value.replace(/,/g, '');

    if (name === 'initialAmount') {
      this.setState({
        initialAmount: numericValue !== '' ? parseFloat(numericValue) : '',
        formattedInitialAmount: formatNumber(numericValue) // Use helper function for formatting
      }, this.calculateResults);
    } else if (name === 'monthlyInvestment') {
      this.setState({
        monthlyInvestment: numericValue !== '' ? parseFloat(numericValue) : '',
        formattedMonthlyInvestment: formatNumber(numericValue) // Use helper function for formatting
      }, this.calculateResults);
    } else {
      this.setState({ [name]: value !== '' ? parseFloat(value) : '' }, this.calculateResults);
    }
  };

  // Function to calculate and set results
  calculateResults = () => {
    const { initialAmount, rateOfInterest, time, monthlyInvestment, yearlyIncrement } = this.state;

    // Call the calculateResults function from the helper
    const { totalInvested, totalReturn, totalAmount, chartData } = calculateResults(
      initialAmount, rateOfInterest, time, monthlyInvestment, yearlyIncrement
    );

    // Set the calculated values in the state
    this.setState({
      totalInvested,
      totalReturn,
      totalAmount,
      chartData, // Set the chart data
      totalAmountInWords: convertNumberToWords(totalAmount) // Convert total amount to words
    });
  };

  render() {
    const { formattedInitialAmount, rateOfInterest, time, formattedMonthlyInvestment, yearlyIncrement, totalInvested, totalReturn, totalAmount, chartData, totalAmountInWords } = this.state;

    return (
      <Segment className="calculator-container" padded style={{ width: '100%', margin: '0' }}> {/* Ensure 100% width */}
        <Header as="h2" textAlign="center">SIP & Lump Sum Maturity Calculator</Header>

        <Grid>
          <Grid.Row>
            {/* Left Column: Input Form (20% width) */}
            <Grid.Column width={4}> {/* 20% width of the page */}
              <Form>
                <Form.Field>
                  <label>Initial Lump Sum Investment</label>
                  <Input
                    placeholder="Enter Initial Lump Sum"
                    type="text"
                    name="initialAmount"
                    value={formattedInitialAmount}
                    onChange={this.handleInputChange}
                    fluid
                  />
                </Form.Field>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Monthly Investment (SIP)</label>
                    <Input
                      placeholder="Enter Monthly Investment"
                      type="text"
                      name="monthlyInvestment"
                      value={formattedMonthlyInvestment}
                      onChange={this.handleInputChange}
                      fluid
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Yearly Increment (%)</label>
                    <Input
                      placeholder="Enter Yearly Increment"
                      type="number"
                      name="yearlyIncrement"
                      value={yearlyIncrement}
                      onChange={this.handleInputChange}
                      fluid
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Field>
                  <label>Time (Years)</label>
                  <Input
                    placeholder="Enter Time in Years"
                    type="number"
                    name="time"
                    value={time}
                    onChange={this.handleInputChange}
                    fluid
                  />
                </Form.Field>
                <Form.Field>
                  <label>Annual Rate of Interest (%)</label>
                  <Input
                    placeholder="Enter Rate of Interest"
                    type="number"
                    name="rateOfInterest"
                    value={rateOfInterest}
                    onChange={this.handleInputChange}
                    fluid
                  />
                </Form.Field>
                {/* Use Semantic UI Button */}
                <Button primary fluid onClick={this.calculateResults}>
                  Calculate
                </Button>
              </Form>
            </Grid.Column>

            {/* Right Column: Output Results and Chart (80% width) */}
            <Grid.Column width={12}> {/* 80% width of the page */}
              <Segment className="result-box">
                <Header as="h3">Investment Summary</Header>
                <p>
                  <strong>Total Amount Invested:</strong> ₹
                  {Math.round(totalInvested).toLocaleString('en-IN')}
                </p>
                <p>
                  <strong>Total Return Earned:</strong> ₹
                  {Math.round(totalReturn).toLocaleString('en-IN')}
                </p>
                <p>
                  <strong>Total Amount at Maturity:</strong> ₹
                  {Math.round(totalAmount).toLocaleString('en-IN')}
                </p>
                <p>
                  <strong>Total Amount in Words:</strong> {totalAmountInWords}
                </p>
              </Segment>
            </Grid.Column>

          </Grid.Row>
        </Grid>
        {chartData && <InvestmentChart chartData={chartData} />}
      </Segment>
    );
  }
}

export default InvestmentCalculator;
