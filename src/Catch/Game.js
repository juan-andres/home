import React from 'react';
import _ from 'lodash';

import Grid from './Grid';
import useAnimationFrame from './useAnimationFrame';
import { withDeviceOrientation } from './withDeviceOrientation';
import { withWebSocketSupport } from './withWebSocketSupport';

function transformRage(iStart, iEnd, oStart, oEnd, value) {
  const slope = 1.0 * (oEnd - oStart) / (iEnd - iStart);
  return Math.round(oStart + slope * (value - iStart));
}

const CatchGameBase = props => {
  const [deltaTime, setDeltaTime] = React.useState(0.0);
  const [velocity, setVelocity] = React.useState([0, 0]);
  const [position, setPosition] = React.useState([0, 0]);

  useAnimationFrame(delta => {
    const orientation = props.getOrientation();
    const g = 1;
    const decay = 0.1;
    const maxVel = 3;
    setVelocity(prevVelocity => {
      const beta = Math.max(-30, Math.min(30, orientation.beta));
      const acc = g * Math.sin(beta * (180 / Math.PI));

      let xVel = prevVelocity[0] - acc;

      const newVelocity = [
        xVel * 0.9,
        // Math.max(-maxVel, Math.min(maxVel, prevVelocity[0] + ( g * Math.sin(Math.max(-30, Math.min(30, orientation.gamma))) * delta))) * 0.9,
        0,
      ];

      return newVelocity;

      newVelocity[0] = Number(newVelocity[0].toFixed(2));

      setPosition(prevPosition => ([
        Math.max(0, Math.min(props.rows - 1,prevPosition[0] + 0.5 * delta * (prevVelocity[0] + newVelocity[0]))),
        0, //0.5 * delta * (prevVelocity[1] + newVelocity[1]),
        // Math.max(0, Math.min(props.rows - 1, prevPosition[0] + (0.5 * delta * (prevVelocity[0] + newVelocity[0])))),
        // Math.max(0, Math.min(props.cols - 1, prevPosition[1] + (0.5 * delta * (prevVelocity[1] + newVelocity[1])))),
      ]));

      return newVelocity;
    });

    setDeltaTime(() => delta);
  });

  const pos = [Math.round(position[0]), position[1]];
  return (
    <div>
      <p>position: [{position[0].toFixed(2)}, {position[1].toFixed(2)}]</p>
      <p>velocity: [{velocity[0].toFixed(2)}, {velocity[1].toFixed(2)}]</p>
      <Grid {...props} position={pos} />
    </div>
  );
};

const CatchGame = withWebSocketSupport()(withDeviceOrientation({ debug: true })(CatchGameBase));

export class Catcher extends React.Component {
  getWebSocketData = () => {
    return {
      action: 'UPDATE',
      position: this.state.position,
    }
  };

  onWebSocketData = data => {
    if (data.action !== 'UPDATE') {
      return;
    }

    this.setState({
      rivals:  {
        ...this.rivals,
        [data.id]: data,
      }
    })

    // const updatedRivals = {
    //   ...this.rivals,
    //   [data.id]: data,
    // };

    // const caught = _.reduce(updatedRivals, (result, r) => {
    //   if (r.i === this.state.i && r.j === this.state.j) {
    //     result.push(r.id);
    //   }
    //   return result;
    // }, []);

    // if (caught.length > 0) {
    //   console.log('caught', caught);

    //   this.ws.send(JSON.stringify({
    //     action: 'CAUGHT',
    //     id: this.id,
    //     i: this.state.i,
    //     j: this.state.j,
    //     caught: caught,
    //   }));
    // }
  };

  render() {
    return (
      <CatchGame
        rows={10}
        cols={5}
        {...this.props}
        colorClass="redCell"
        onWebSocketData={this.onWebSocketData} 
        getWebSocketData={this.getWebSocketData}
      />
    );
  }
}

export const Runner = () => <CatchGame colorClass="blueCell" />;

export default CatchGame;
