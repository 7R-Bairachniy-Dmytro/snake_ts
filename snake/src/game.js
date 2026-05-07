import {BitmapText, Container, Graphics} from "pixi.js";


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
    this.isRunning = false;
  }

  step = interval => {

  }

  set moveDirection(direction) {
    this.currentDirection = direction;
  }

  get moveDirection() {
    return this.currentDirection;
  }


  move() {
    if ( this.mode === eMode.classic ) {
      let headPosition = new Cell(this.snake.headPosition.x, this.snake.headPosition.y);
      switch (this.currentDirection) {
        case directions.LEFT:
          if (headPosition.x > 0) {
            headPosition.x--;
          }else{
            this.isRunning = false;
          }
          break;
        case directions.RIGHT:
          if (headPosition.x < this.field.width-1) {
            headPosition.x++;
          }else{
            this.isRunning = false;
          }
          break;
        case directions.UP:
          if (headPosition.y > 0) {
            headPosition.y--;
          }else{
            this.isRunning = false;
          }
          break;
        case directions.DOWN:
          if (headPosition.y < this.field.height-1) {
            headPosition.y++;
          }else{
            this.isRunning = false;
          }
          break;
      }

      if ( headPosition.x === this.food.x && headPosition.y === this.food.y){
        this.snake.ate(headPosition);
        this.generateFood();
      }else{
        this.snake.moveHead(headPosition);
      }
    }

  }

  // movementToTheLeft(){
  //   let headPosition = new Cell(this.snake.headPosition.x, this.snake.headPosition.y);
  //   if (headPosition.x > 0) {
  //     headPosition.x--;
  //   }else{
  //     this.isRunning=false;
  //   }
  // }

  generateFood(){
    let placed = false;
    while(!placed) {

      let x = Math.floor(Math.random() * this.field.width);
      let y = Math.floor(Math.random() * this.field.height);
      placed = true;
      for (let s=0; s<this.snake.body.length; s++ ) {
        if ( this.snake.body[s].x === x && this.snake.body[s].y === y ) {
          placed = false;
        }
      }

      if (placed) {
        this.food.x = x;
        this.food.y = y;
      }
      // walls
    }
  }

  start = () => {
    let elapsed = 0;
    this.generateFood();
    this.isRunning = true
    this.app.ticker.add((delta)=>{

        elapsed += delta.deltaMS / 200;

        if (elapsed >= 0.5) {
          if (this.isRunning) {
            // слушаем клавиатуру
            window.addEventListener('keydown', (e) => {
              switch (e.key) {
                case 'ArrowLeft':
                  this.currentDirection = directions.LEFT;
                  break;
                case 'ArrowRight':
                  this.currentDirection = directions.RIGHT;
                  break;
                case 'ArrowUp':
                  this.currentDirection = directions.UP;
                  break;
                case 'ArrowDown':
                  this.currentDirection = directions.DOWN;
                  break;
              }
            });

            this.move();

            this.field.Draw(this.snake, this.food, this.container);
            //console.log('Half second passed');
            elapsed = 0;
          }else{
            this.container.reset;
            const graphics = new Graphics();
            graphics.rect(0, 0, 600, 600);
            graphics.fill('#918e8e');

            this.container.addChild(graphics);

            const gameOverText = new BitmapText({
              text: 'GAME OVER',
              style: {
                fontFamily: 'Custom',
                fontSize: 20,
                fill: '#e60000',
                align: 'center',
              },
              scale: 2,
              anchor: 0.5,
              position: { x: this.container.width / 2, y: this.container.height / 2},
            })

            this.container.addChild(gameOverText);
          }
        }
    });
  //  this.generateFood();
   // this.field.Draw(this.snake,this.food,this.container);
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

export class Field {
  constructor(size) {
   // super();
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
    container.reset;

    const cell = new Graphics();

    const playField = new Graphics();
    playField.rect(0, 0, 600, 600);
    playField.fill('#676767');
    container.addChild(playField);
    container.width = playField.width;
    // Create grid background
    const grid = new Graphics();
    const gridSize = 30;
    for (let x = 0; x < playField.width; x += gridSize) {
      grid.moveTo(x, 0).lineTo(x, playField.height);
    }
    for (let y = 0; y < playField.height; y += gridSize) {
      grid.moveTo(0, y).lineTo(playField.width, y);
    }
    grid.stroke({ width: 1, color: '#7e7d7d' });
    container.addChild(grid);

    for (let s=0; s<snake.body.length; s++ ) {
      cell.rect(gridSize * snake.body[s].x, gridSize * snake.body[s].y, gridSize, gridSize);
      cell.fill('#c31010');

    }

    //food
    cell.rect(gridSize*food.getX(),gridSize*food.getY(),gridSize,gridSize);
    cell.fill('#38951e');
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
