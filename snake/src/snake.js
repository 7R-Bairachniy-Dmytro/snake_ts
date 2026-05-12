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

  atePortal = (cell,portal) => {
    if (portal.length > 0 && portal.length < 3) {
      for (let i = 0; i < portal.length; i++) {
        if (cell.x === portal[i].x && cell.y === portal[i].y) {
          if (i === 0) {
            i++;
          } else {
            i--;
          }

          this.currentHeadPosition = portal[i]
          this.body.unshift(portal[i]);
          break;
        }
      }
    }
  }

  checkSelfEating = cell => {
    for (let i = 0; i < this.body.length; i++) {
      if (i<this.body.length-1){
        if ( this.body[i].x === cell.x && this.body[i].y ===cell.y) {
          return true;
        }
      }
    }
    return false;
  }

  get headPosition() {
    return this.currentHeadPosition;
  }
}
