import React from 'react';

import Grid from './Grid';

function transformRage(iStart, iEnd, oStart, oEnd, value) {
  const slope = 1.0 * (oEnd - oStart) / (iEnd - iStart);
  return Math.round(oStart + slope * (value - iStart));
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

class CatchGame extends React.Component {
  constructor(props) {
    super(props);

    this.id = uuidv4();

    this.m = 10;
    this.n = 10;

    this.state = {
      i: 0,
      j: 0,
      alpha: 0.0,
      beta: 0.0,
      gamma: 0.0,
    };
  }

  componentDidMount() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', this.deviceOrientationHandler, false);
    } else {
      alert('Use your phone instead!');
    }

    // TODO: pass websocket server as a variable
    let websockerServerUrl;
    if (window.location.origin.indexOf('github.io') >= 0) {
      websockerServerUrl = 'wss://catchgameserver.herokuapp.com/';
    } else {
      websockerServerUrl = window.location.origin.replace('http', 'ws');
      websockerServerUrl = websockerServerUrl.replace(':3000', ':3001');
    }
    
    const ws = new WebSocket(websockerServerUrl);
    ws.onopen = () => {
      setInterval(() => {
        ws.send(JSON.stringify({
          id: this.id,
          i: this.state.i,
          j: this.state.j,
        }));
      }, 100);
    };

    ws.onerror = err => console.log('onerror', err);
    ws.onclose = err => console.log('onclose', err);
    ws.onmessage = event => {
      try {
        const rival = JSON.parse(event.data);
        this.setState({
          rivals: {
            ...this.rivals,
            [rival.id]: rival,
          },
        });
      } catch (e) {
        console.log('error parsing message', e);
      }
    };
  }

  deviceOrientationHandler = evt => {
    const beta = evt.beta.toFixed(2);
    const gamma = evt.gamma.toFixed(2);
    const i = transformRage(-30, 30, 0, this.m - 1, beta);
    const j = transformRage(-30, 30, 0, this.n - 1, gamma);
    this.setState({
      i,
      j,
      beta,
      gamma,
      alpha: evt.alpha.toFixed(2),
    });
  }

  renderDebug() {
    return (
      <div className="debugContainer">
        <p>i: {this.state.i} </p>
        <p>j: {this.state.j} </p>
        <p>alpha: {this.state.alpha}</p>
        <p>beta: {this.state.beta}</p>
        <p>gamma: {this.state.gamma}</p>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderDebug()}
        <Grid
          m={this.m}
          n={this.n}
          i={this.state.i}
          j={this.state.j}
          rivals={this.state.rivals}
          colorClass={this.props.colorClass}
        />
      </div>
    );
  }
}

export const Catcher = () => <CatchGame colorClass="redCell" />;
export const Runner = () => <CatchGame colorClass="blueCell" />;

export default CatchGame;
