import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Link to={'/catch_game/catcher'}>Catcher</Link>
        <Link to={'/catch_game/runner'}>Runner</Link>
      </div>
    );
  }
}

export default App;
