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
      // out of bounds
      await this.drawNext(pNext, 'invalid', 'easeInQuad');
      await this.drawNext(pNext, 'empty', 'easeOutQuad');
      return;
    }


    if (pNext[0] === this.destination[0] && pNext[1] === this.destination[1]) {
      await this.drawNext(pNext, 'success', 'easeInQuad');
      await this.drawNext(pNext, 'grid', 'easeOutQuad');
      return;
    }

    await this.drawNext(pNext, 'next', 'easeInQuad');
    await this.move([...path, pNext], LEFT_OFFSET);
    await this.move([...path, pNext], DOWN_OFFEST);
    await this.drawNext(pNext, 'grid', 'easeOutQuad');
  }

  async solve() {
    const initPosition = [0, 0];
    await this.drawNext(initPosition, 'next', 'easeInQuad');
    await this.move([initPosition], LEFT_OFFSET);
    await this.move([initPosition], DOWN_OFFEST);
    await this.drawNext(initPosition, 'grid', 'easeOutQuad');
  }
}
