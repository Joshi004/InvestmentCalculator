import React, { Component } from 'react';
import { Tab, Segment } from 'semantic-ui-react'; // Import Tab and Segment from Semantic UI
import InvestmentCalculator from '../InvestmentCalculator/InvestmentCalculator'; // Import your investment calculator
import ExpenseCalculator from '../ExpenseCalculator/ExpenseCalculator'; // Import your expense calculator

class CalculatorContainerComponent extends Component {
  // Define the panes (tabs) for the Tab component
  panes = [
    {
      menuItem: 'Expense Calculator',
      render: () => (
        <Tab.Pane>
          <ExpenseCalculator />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Investment Calculator',
      render: () => (
        <Tab.Pane>
          <InvestmentCalculator />
        </Tab.Pane>
      ),
    },
  ];

  render() {
    return (
      <Segment>
        {/* Semantic UI Tab with class component */}
        <Tab panes={this.panes} />
      </Segment>
    );
  }
}

export default CalculatorContainerComponent;
