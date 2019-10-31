import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import './styles.css';

function getId(i, j) {
  return `${i}\-${j}`
}

class Grid extends React.Component {
  renderCell = (i, j) => {
    const id = getId(i, j);
    const cellClasses = classNames({
      'cell': true,
      [this.props.colorClass]: this.props.position[0] === i && this.props.position[1] === j,
      'rival': _.some(this.props.rivals, r => r.position[0] === i && r.position[1] === j),
    })
    return (
      <td className={cellClasses} id={id} key={id}></td>
    );
  }

  renderRow = i => (
    <tr key={i}>{_.map(_.range(this.props.cols), j => this.renderCell(i, j))}</tr>
  );

  render() {
    return (
      <table>
        <tbody>
          {_.map(_.range(this.props.rows), i => this.renderRow(i))}
        </tbody>
      </table>
    );
  }
}

export default Grid;
