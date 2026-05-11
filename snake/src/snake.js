import {Cell} from "./cell.js";
import {DefaultSettings} from "./vars.js";

export class Snake extends Cell {

  constructor() {
    super();
    this.currentHeadPosition = new Cell(DefaultSettings.headPositionX,DefaultSettings.headPositionY);
    this.body = [];
    this.body[0] = this.currentHeadPosition;
    this.body[1] = new Cell(10,9);
  }

  moveHead = cell => {
    if ( this.currentHeadPosition.x !== cell.x || this.currentHeadPosition.y !== cell.y) {
      this.currentHeadPosition = cell;
      this.body.unshift(cell);
      this.body.pop();
    }
  }

  ate = cell => {
    if (this.currentHeadPosition.x !== cell.x || this.currentHeadPosition.y !== cell.y) {
      this.currentHeadPosition = cell;
      this.body.unshift(cell);
    }
  }

  checkSelfEating = cell => {
    for (let i = 0; i < this.body.length; i++) {
      if ( this.body[i].x === cell.x && this.body[i].y ===cell.y) {
        return true;
      }
    }
    return false;
  }

  get headPosition() {
    return this.currentHeadPosition;
  }
}
