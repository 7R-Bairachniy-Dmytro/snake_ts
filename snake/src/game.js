import {Container, Graphics} from "pixi.js";


const DefaultSettings = {
  fieldCellSize: 20,
  headPositionX: 9,
  headPositionY: 9
}

var directions = {
  RIGHT: 1,
  LEFT: 2,
  UP: 3,
  DOWN: 4,
}


var eMode = {
  classic: 1,
  noDie:2,
  walls:3
}

export default class Game {
  constructor(field,snake,food,container,app) {
    this.field = field;
    this.food = food;
    this.snake = snake;
    this.currentDirection = directions.LEFT;
    this.mode = eMode.classic;
    this.container = container;
    this.app = app;
  }

  step = interval => {

  }

  set moveDirection(direction) {
    this.currentDirection = direction;
  }

  get moveDirection() {
    return this.currentDirection;
  }


  move = direction => {
    if ( this.mode === eMode.classic ) {
      let headPosition = this.snake.headPosition();
      switch (direction) {
        case directions.LEFT:
          if (headPosition.x > 0) {
            headPosition.x--;
          }
          break;
        case directions.RIGHT:
          if (headPosition.x < this.field.width) {
            headPosition.x++;
          }
          break;
        case directions.UP:
          if (headPosition.y < this.field.height) {
            headPosition.y++;
          }
          break;
        case directions.DOWN:
          if (headPosition.y > 0) {
            headPosition.y--;
          }
      }

      if ( headPosition === this.food){
        this.snake.ate(headPosition);
      }else{
        this.snake.moveHead(headPosition);
      }
    }

  }

  start = () => {
    app.tick
    this.field.Draw(this.snake,this.food,this.container);
  }
}

export class Cell {
  x=0;
  y=0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getX = () =>{
    return this.x;
  }
  getY(){
    return this.y;
  }
}

export class Field extends Container {
  constructor(size) {
    super();
    this.height = size;
    this.width = size;
  }

  get Height() {
    return this.height;
  }

  get Width() {
    return this.width;
  }

  Draw(snake,food, container){
    const cell = new Graphics();
    const gridSize = 30;
    // for ( let i=0; i<this.width; i++){
    //   for ( let j=0; j<this.height; j++){
    //     for (let s of snake){
    //       if (s.x===i && s.y===j){
    //         cell.rect(gridSize*i,gridSize*i,gridSize,gridSize);
    //         cell.fill('#c31010');
    //       }
    //     }
    //   }
    // }
    for (let s=0; s<snake.body.length; s++ ) {
      cell.rect(gridSize * snake.body[s].x, gridSize * snake.body[s].y, gridSize, gridSize);
      cell.fill('#c31010');

    }
    console.log(snake.body.length);
    // cell.rect(50, 50, 100, 100);
    // cell.fill(0xde3249);

    container.addChild(cell);
  }

}

export class Snake extends Cell {

  constructor() {
    super();
    this.currentHeadPosition = new Cell(DefaultSettings.headPositionX,DefaultSettings.headPositionY);
    this.body = [];
    this.body[0] = this.currentHeadPosition;
    this.body[1] = new Cell(10,9);
  }

  moveHead = cell => {
    this.currentHeadPosition = cell;
    this.body.unshift(cell);
    this.body.pop();
  }

  ate = cell =>{
    this.currentHeadPosition = cell;
    this.body.unshift(cell);
  }

  get headPosition() {
    return this.currentHeadPosition;
  }
}

export class Food extends Cell {
  constructor(x,y) {
    super();
    this.x = x;
    this.y = y;
  }
  getX(){
    return this.x;
  }
  getY(){
    return this.y;
  }
}
