import React from 'react';
import ReactDOM from 'react-dom';
import { Route, HashRouter as Router } from 'react-router-dom';

import App from './App';
import UniquePaths from './UniquePaths';
import CatchGame from './Catch/Game';

import './index.css';

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/unique_paths" component={UniquePaths} />
      <Route path="/catch_game" component={CatchGame} />
    </div>
  </Router>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);
