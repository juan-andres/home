import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Link to={'/catch_game'}>Catch Game</Link>
        <p id='server-time'></p>
      </div>
    );
  }
}

export default App;
