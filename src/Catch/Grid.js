import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import './styles.css';

function getId(i, j) {
  return `${i}\-${j}`
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.m = props.m;
    this.n = props.n;
  }

  renderCell = (i, j) => {
    console.log('rendering', i, j);
    const id = getId(i, j);
    const cellClasses = classNames({
      'cell': true,
      'active': this.props.i === i && this.props.j === j,
    })
    return (
      <td className={cellClasses} id={id} key={id}></td>
    );
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

export default Grid;
