const LEFT_OFFSET = [0, 1];
const DOWN_OFFEST = [1, 0];

export class UniquePathsSolver {
  constructor(m, n, drawNext) {
    this.destination = [m - 1, n - 1];
    this.drawNext = drawNext;
  }

  async move(path, offset) {
    const pCurr = path[path.length - 1];
    const pNext = [
      pCurr[0] + offset[0],
      pCurr[1] + offset[1],
    ];

    if (pNext[0] > this.destination[0] || pNext[1] > this.destination[1]) {
      // out of bounds, don't wait for it to clear
      await this.drawNext(pNext, 'invalid');
      await this.drawNext(pNext, 'empty');
      return;
    }


    if (pNext[0] === this.destination[0] && pNext[1] === this.destination[1]) {
      await this.drawNext(pNext, 'success');
      await this.drawNext(pNext, 'grid');
      return;
    }

    await this.drawNext(pNext, 'next');
    await this.move([...path, pNext], LEFT_OFFSET);
    await this.move([...path, pNext], DOWN_OFFEST);
    await this.drawNext(pNext, 'grid');
  }

  async solve(initPosition) {
    await this.drawNext(initPosition, 'next');
    await this.move([initPosition], LEFT_OFFSET);
    await this.move([initPosition], DOWN_OFFEST);
    await this.drawNext(initPosition, 'grid');
  }
}
