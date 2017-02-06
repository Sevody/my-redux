import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  minus(){
    this.props.minus()
  }
  render() {
    return (
      <div className="App">
        <h3>redux counter</h3>
        <div className="counter">
          <div className="minus" onClick={()=>this.minus()}>-</div>
          <input type="text" value={this.props.value}/>
          <div className="plus" onClick={this.props.plus}>+</div>
        </div>
      </div>
    );
  }
}

export default App;
