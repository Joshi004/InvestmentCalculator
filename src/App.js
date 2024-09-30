import React, { Component } from 'react';
import './App.scss'; // Import the SCSS file for App
import CalculatorContainerComponent from './Components/CalculatorContainer/CalculatorContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <CalculatorContainerComponent />
      </div>
    );
  }
}

export default App;
