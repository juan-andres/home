import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, HashRouter as Router } from 'react-router-dom';

import App from './App';
import TwitchDeal from './TwitchDeal';

import './index.css';

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/deal" component={TwitchDeal} />
    </div>
  </Router>
)

ReactDOM.render(
  routing,
  document.getElementById('root')
);
