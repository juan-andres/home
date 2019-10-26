import React, { Component } from 'react';
import _ from 'lodash';
import anime from './anime.min.js';

import { UniquePathsSolver } from './solver.js';

import './UniquePaths.css';

const COLORS = {
  success: '#4EE5D3',
  grid: '#524948',
  next: '#57467B',
  invalid: '#FF3900',
  empty: 'rgba(0,0,0,0)',
}

function getId(i, j) {
  return `${i}\-${j}`
}

class UniquePaths extends Component {
  constructor(opts) {
    super(opts);

    this.state = {
      isSolving: false,
    };

    this.m = 5;
    this.n = 5;
    this.solver = new UniquePathsSolver(this.m, this.n, this.drawNext);
  }

  onClick = (i, j) => () => {
    this.setState({
      isSolving: true,
    }, async () => {
      await this.solver.solve([i, j]);
      await this.drawAnswer();
    });
  }

  drawAnswer = async () => {
    const el = document.getElementById(getId(this.m - 1, this.n - 1));
    const animation = anime.timeline({
      duration: 100,
    });
    animation.add({
      targets: [el],
      backgroundColor: '#CAFE48',
      scale: 2,
      color: '#000',
      easing: 'spring(1, 80, 10, 0)',
    });
  }

  drawNext = async (p, color) => {
    const animation = anime.timeline({
      duration: 1,
    });

    const el = document.getElementById(getId(p[0], p[1]));

    if (color === 'next' || color === 'success') {
      el.innerText = parseInt(el.innerText, 10) + 1;
    }

    animation.add({
      targets: [el],
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
    return (
      <td className={className} id={id} key={id} onClick={this.onClick(i, j)}>
        0
      </td>
    );
  }

  renderRow = i => (
    <tr key={i}>{_.map(_.range(this.n + 1), j => this.renderCell(i, j))}</tr>
  );

  render() {
    return (
      <div className="container">
        <h1>Unique Paths</h1>
        <p>
          If you could only move LEFT, DOWN, how many unique paths from (0, 0) to (4, 4) are there?
          <button disabled={this.state.isSolving} onClick={this.onClick(0, 0)}>solve</button>
        </p>
        <table>
          <tbody>
            {_.map(_.range(this.m + 1), i => this.renderRow(i))}
          </tbody>
        </table>
      </div>
    );
  }
}



export default UniquePaths;
