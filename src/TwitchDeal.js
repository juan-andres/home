import React, { Component } from 'react';
import _ from 'lodash';
import anime from './anime.min.js';

import { UniquePathsSolver } from './solver.js';

import './TwitchDeal.css';

const COLORS = {
  success: '#75C9C8',
  grid: '#F7F4EA',
  next: '#DED9E2',
  invalid: '#C0B9DD',
  empty: 'rgba(0,0,0,0)',
}

function getPointId(p) {
  return getId(p[0], p[1]);
}

function getId(i, j) {
  return `${i}\-${j}`
}

class TwitchDeal extends Component {
  constructor(opts) {
    super(opts);
    this.m = 10;
    this.n = 10;
    this.solver = new UniquePathsSolver(this.m, this.n, this.drawNext);
  }
  async componentDidMount() {
    await this.solver.solve();
  }

  drawNext = async (p, color, easing) => {
    const animation = anime.timeline({
      duration: 1,
      easing: easing,
    });

    animation.add({
      targets: [document.getElementById(getPointId(p))],
      backgroundColor: COLORS[color],
    });

    await animation.finished;
  };

  getClass = (i, j) => {
    return (i < this.m && j < this.n) ? 'cell' : 'boundary';
  }

  renderCell = (i, j) => {
    const id = getId(i, j);
    const className = this.getClass(i, j);
    return <td className={className} id={id} key={id}></td>
  }

  renderRow = i => (
    <tr key={i}>{_.map(_.range(this.n + 1), j => this.renderCell(i, j))}</tr>
  );

  render() {
    return (
      <table>
        <tbody>
          {_.map(_.range(this.m + 1), i => this.renderRow(i))}
        </tbody>
      </table>
    );
  }
}



export default TwitchDeal;
