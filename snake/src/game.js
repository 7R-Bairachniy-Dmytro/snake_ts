import {Assets, BitmapText, Container, Graphics} from "pixi.js";
import {CheckBox, RadioGroup} from "@pixi/ui";
import {createButton} from "./button.js";
import {Cell} from "./cell.js";
import {directions, eMode} from "./vars.js";
import {Snake} from "./snake.js";


export default class Game {
  constructor(field, snake, food, app) {
    this.field = field;
    this.food = food;
    this.snake = snake;
    this.currentDirection = directions.LEFT;
    this.mode = eMode.classic;
    this.app = app;
    this.isRunning = false;
    this.elapsed = 0;
    this.walls = [];
    this.portal = [];
    this.speed = 300;
    this.score = 0;
    this.moved = false;
    this.updateBestScore();

    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (this.currentDirection !== directions.RIGHT && this.moved) {
            this.currentDirection = directions.LEFT;
            this.moved = false;
          }
          break;
        case 'ArrowRight':
          if (this.currentDirection !== directions.LEFT && this.moved) {
            this.currentDirection = directions.RIGHT;
            this.moved = false;
          }
          break;
        case 'ArrowUp':
          if (this.currentDirection !== directions.DOWN && this.moved) {
            this.currentDirection = directions.UP;
            this.moved = false;
          }
          break;
        case 'ArrowDown':
          if (this.currentDirection !== directions.UP && this.moved) {
            this.currentDirection = directions.DOWN;
            this.moved = false;
          }
          break;
      }
    });

  }

  createMenuElements(){
    this.gameNameTitle = new BitmapText({
      text: 'Snake Game',
      style: {
        fontFamily: 'Custom',
        fontSize: 20,
        fill: '#61c65d',
        align: 'center',
      },
      scale: 2,
      anchor: 0.5,
      position: { x: this.menuContainer.width / 2, y: this.menuContainer.height / 15},
    });

    this.menuTextBest = new BitmapText({
      text: 'Best: '+this.best,
      style: {
        fontFamily: 'Custom',
        fontSize: 20,
        fill: '#ffffff',
        align: 'center',
      },
      scale: 2,
      anchor: 0.5,
      position: { x: this.menuContainer.width / 2, y: this.menuContainer.height / 4},
    })
  }

  updateBestScore() {
    let val = JSON.parse(localStorage.getItem('best'));
    if (val === null || val === undefined) {
      this.best = 0;
    } else {
      this.best = val;
    }
  }

  set moveDirection(direction) {
    this.currentDirection = direction;
  }

  get moveDirection() {
    return this.currentDirection;
  }

  move() {

    let headPosition = new Cell(this.snake.headPosition.x, this.snake.headPosition.y);

    // if (this.mode === eMode.portal) {
    //   if (this.portal.length > 0) {
    //     for (let i = 0; i < this.portal.length; i++) {
    //       if (headPosition.x === this.portal[i].x && headPosition.y === this.portal[i].y) {
    //         if (i === 0) {
    //           i++;
    //         } else {
    //           i--;
    //         }
    //         headPosition.x = this.portal[i].x;
    //         headPosition.y = this.portal[i].y;
    //
    //         this.generatePortal()
    //
    //         break;
    //       }
    //     }
    //   }
    // }
    switch (this.currentDirection) {
      case directions.LEFT:
        if (headPosition.x > 0) {
          headPosition.x--;
        } else if (this.mode === eMode.noDie) {
          headPosition.x = this.field.width - 1;
        } else {
          this.isRunning = false;
        }
        break;
      case directions.RIGHT:
        if (headPosition.x < this.field.width - 1) {
          headPosition.x++;
        } else if (this.mode === eMode.noDie) {
          headPosition.x = 0;
        } else {
          this.isRunning = false;
        }
        break;
      case directions.UP:
        if (headPosition.y > 0) {
          headPosition.y--;
        } else if (this.mode === eMode.noDie) {
          headPosition.y = this.field.height - 1;
        } else {
          this.isRunning = false;
        }
        break;
      case directions.DOWN:
        if (headPosition.y < this.field.height - 1) {
          headPosition.y++;
        } else if (this.mode === eMode.noDie) {
          headPosition.y = 0;
        } else {
          this.isRunning = false;
        }
        break;
    }

    let validateSelfEating = false;

    if (this.mode === eMode.noDie) {
      validateSelfEating = true;
    } else {
      if (this.snake.checkSelfEating(headPosition)) {
        this.isRunning = false;
        validateSelfEating = false;
      } else {
        validateSelfEating = true;
      }
    }

    let isWall = false;
    if (this.mode === eMode.walls) {
      if (this.checkWallPosition(headPosition.x, headPosition.y)) {
        this.isRunning = false;
        validateSelfEating = false;
      }
    }

    if (validateSelfEating) {
      if (this.checkFoodOrPortal(headPosition)) {
        if (this.mode === eMode.portal){
          this.snake.atePortal(headPosition,this.portal);
          this.generatePortal()
        }else{
          this.snake.ate(headPosition);
          this.generateFood();
        }

        if (this.mode === eMode.walls) {
          this.generateWall();
        }

        // stats
        this.score++;
        let possibleBest = JSON.parse(localStorage.getItem('best'));
        if (this.score > possibleBest) {
          localStorage.setItem('best', JSON.stringify(this.score));
        }

        if (this.menuTextScore) {
          this.menuTextScore.text = 'Score: ' + this.score;
        }

        if (this.mode === eMode.speed) {
          if (this.speed > 11) {
            this.speed -= 10;
          }
        }
      } else {
        this.snake.moveHead(headPosition);

      }
      this.moved = true;
    }

  }

  checkFoodOrPortal(headPosition) {
    if (this.mode === eMode.portal) {
      return this.checkPortalPosition(headPosition.x,headPosition.y)
    } else {
      if (headPosition.x === this.food.x && headPosition.y === this.food.y){
        return true
      }
    }
    return false;
  }


  generateWall() {
    let placed = false;
    while (!placed) {
      let firstX = Math.floor(Math.random() * this.field.width);
      let firstY = Math.floor(Math.random() * this.field.height);
      let isSnakePos = this.checkSnakePosition(firstX, firstY);

      if (!isSnakePos) {
        this.walls.push(new Cell(firstX, firstY));
        placed = true;
      }
    }
  }
  // generateWalls() {
  //   this.walls = [];
  //   let wallsCount = Math.floor(Math.random() * 10) + 5;
  //
  //   for (let i = 0; i < wallsCount; i++) {
  //     let wallCells = Math.floor(Math.random() * 7) + 2;
  //
  //     let placed = false;
  //
  //     let cellX = -1;
  //     let cellY = -1;
  //     while (!placed) {
  //       let firstX = Math.floor(Math.random() * this.field.width);
  //       let firstY = Math.floor(Math.random() * this.field.height);
  //       let isSnakePos = this.checkSnakePosition(firstX, firstY);
  //
  //       if (!isSnakePos) {
  //         this.walls.push(new Cell(firstX, firstY));
  //         cellX = firstX;
  //         cellY = firstY;
  //         placed = true;
  //       }
  //     }
  //     for (let j = 0; j < wallCells; j++) {
  //
  //       let placed = false;
  //       while (!placed) {
  //         let direction = Math.floor(Math.random() * 5) + 1;
  //         let checkX = cellX;
  //         let checkY = cellY;
  //         switch (direction) {
  //           case directions.LEFT:
  //             checkX--;
  //             if (cellX > 0 && !this.checkSnakePosition(checkX, cellY)) {
  //               cellX--;
  //               this.walls.push(new Cell(cellX, cellY));
  //               placed = true;
  //             }
  //             break;
  //           case directions.RIGHT:
  //             checkX++;
  //             if (cellX < this.field.width - 1 && !this.checkSnakePosition(checkX, cellY)) {
  //               cellX++;
  //               this.walls.push(new Cell(cellX, cellY));
  //               placed = true;
  //             }
  //             break;
  //           case directions.DOWN:
  //             checkY++;
  //             if (cellY < this.field.height - 1 && !this.checkSnakePosition(cellX, checkY)) {
  //               cellY++;
  //               this.walls.push(new Cell(cellX, cellY));
  //               placed = true;
  //             }
  //             break;
  //           case directions.UP:
  //             checkY--;
  //             if (cellY > 0 && !this.checkSnakePosition(cellX, checkY)) {
  //               cellY--;
  //               this.walls.push(new Cell(cellX, cellY));
  //               placed = true;
  //             }
  //             break;
  //         }
  //       }
  //     }
  //   }
  // }

  checkSnakePosition(x,y){
    for (let s=0; s<this.snake.body.length; s++ ) {
      if ( this.snake.body[s].x === x && this.snake.body[s].y === y ) {
        return true;
      }
    }
    return false;
  }

  checkWallPosition(x,y){
    for (let s=0; s<this.walls.length; s++ ) {
      if ( this.walls[s].x === x && this.walls[s].y === y ) {
        return true;
      }
    }
    return false;
  }

  checkPortalPosition(x,y){
    for (let s=0; s<this.portal.length; s++ ) {
      if ( this.portal[s].x === x && this.portal[s].y === y ) {
        return true;
      }
    }
    return false;
  }

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

      if ( this.mode === eMode.walls ) {
        placed = !this.checkWallPosition(x,y);
      }

      if (placed) {
        this.food.x = x;
        this.food.y = y;
      }
    }
  }

  generatePortal(){
    this.portal = [];
    for (let s=0; s<2; s++ ) {
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
          let cell = new Cell(x,y);
          this.portal.push(cell);
        }
      }
    }

  }

  startScreen(){
    this.generateFood();
    this.field.Draw(this.snake,this.food,this.walls,this.portal)
  }

  onTick = (delta) => {
    this.elapsed += this.app.ticker.deltaMS / this.speed;

    if (this.elapsed >= 0.5) {
      if (this.isRunning) {

        this.move();
        this.field.Draw(this.snake, this.food,this.walls,this.portal);

        this.elapsed = 0;
      } else {
        this.field.gameOverScreen();
        let possibleBest = JSON.parse(localStorage.getItem('best'));
        if (this.score>possibleBest) {
          localStorage.setItem('best', JSON.stringify(this.score));
        }
      }
    }
  }

  stop() {
    this.elapsed = 0;
    this.snake.resetSnake();
    this.generateFood();
    this.portal = [];
    this.walls = [];
    this.field.Draw(this.snake, this.food,this.walls,this.portal);
    this.isRunning = false;
    this.mode = eMode.classic;

    this.app.ticker.remove(this.onTick);

    this.destroyPlayMenuElems();
    this.menuField.removeChildren();
    this.menuField.clear();

    this.createMenu();
  }

  start() {
    if (this.mode!==eMode.walls){
      this.walls = [];
    }else{
      this.generateWall();
    }

    this.speed = 200;
    if (this.mode === eMode.speed){
      this.speed = 350;
    }
    this.currentDirection = directions.LEFT;
    this.score = 0;
    this.menuField.children.forEach(child => {
      if (child.destroy) child.destroy();
    });
    this.destroyMenuElems();
    this.menuField.removeChildren();
    this.menuField.clear();

    this.createPlayMenu();
    this.snake.resetSnake();
    if (this.mode === eMode.portal){
      this.generatePortal()
      this.food.x = -100;
      this.food.y = -100;
    }else{
      this.portal = [];
      this.generateFood();
    }
    this.isRunning = true;
    this.elapsed = 0;

    this.app.ticker.add(this.onTick);
    //this.app.ticker.start();
  }

  async loadData(){
    this.uncheckedTex = await Assets.load("unchecked.png");
    this.checkedTex = await Assets.load("checkbox.png");
  }

  createPlayMenu(){

    this.menuField.rect(0,0,300, 600).fill('#087c80');
    this.menuContainer.width = this.menuField.width;

    this.gameNameTitle = new BitmapText({
      text: 'Snake Game',
      style: {
        fontFamily: 'Custom',
        fontSize: 20,
        fill: '#61c65d',
        align: 'center',
      },
      scale: 2,
      anchor: 0.5,
      position: { x: this.menuContainer.width / 2, y: this.menuContainer.height / 15},
    });
    this.menuField.addChild(this.gameNameTitle);

    this.updateBestScore();

    this.menuTextBest = new BitmapText({
      text: 'Best: '+this.best,
      style: {
        fontFamily: 'Custom',
        fontSize: 20,
        fill: '#ffffff',
        align: 'center',
      },
      scale: 2,
      anchor: 0.5,
      position: { x: this.menuContainer.width / 2, y: this.menuContainer.height / 4},
    })
    this.menuField.addChild(this.menuTextBest);


    this.menuRectScore = new Graphics();
    this.menuRectScore.rect(0,0, this.menuField.width, this.menuField.height/10)
      .fill('#215b60');
    this.menuField.addChild(this.menuRectScore);
    this.menuRectScore.y = this.menuField.height/3;

    this.menuTextScore = new BitmapText({
      text: 'Score: '+ this.score,
      style: {
        fontFamily: 'Custom',
        fontSize: 20,
        fill: '#ffffff',
        align: 'center',
      },
      scale: 2,
      anchor: 0.5,
      position: { x: this.menuContainer.width / 2, y: this.menuContainer.height / 2.59},
    })
    this.menuField.addChild(this.menuTextScore);

    // Buttons
    this.buttonMenu = createButton('Menu');
    this.buttonMenu.x = this.menuField.x+80;
    this.buttonMenu.y = this.menuField.height-100;


    this.buttonMenu.on('pointerdown', () => {
      this.stop();
    });

    this.menuField.addChild(this.buttonMenu);
  }

  createMenu(){
    this.menuField.rect(0,0,300, 600).fill('#087c80');

    this.menuContainer.width = this.menuField.width;
    this.gameNameTitle = new BitmapText({
      text: 'Snake Game',
      style: {
        fontFamily: 'Custom',
        fontSize: 20,
        fill: '#61c65d',
        align: 'center',
      },
      scale: 2,
      anchor: 0.5,
      position: { x: this.menuContainer.width / 2, y: this.menuContainer.height / 15},
    });
    this.menuField.addChild(this.gameNameTitle);

    this.updateBestScore();
    this.menuTextBest = new BitmapText({
      text: 'Best: '+this.best,
      style: {
        fontFamily: 'Custom',
        fontSize: 20,
        fill: '#ffffff',
        align: 'center',
      },
      scale: 2,
      anchor: 0.5,
      position: { x: this.menuContainer.width / 2, y: this.menuContainer.height / 4},
    })
    this.menuField.addChild(this.menuTextBest);

    this.menuRectScore = new Graphics();
    this.menuRectScore.rect(0,0, this.menuField.width, this.menuField.height/10)
      .fill('#215b60');
    this.menuField.addChild(this.menuRectScore);
    this.menuRectScore.y = this.menuField.height/3;

    this.menuTextScore = new BitmapText({
      text: 'Score: '+ this.score,
      style: {
        fontFamily: 'Custom',
        fontSize: 20,
        fill: '#ffffff',
        align: 'center',
      },
      scale: 2,
      anchor: 0.5,
      position: { x: this.menuContainer.width / 2, y: this.menuContainer.height / 2.59},
    })
    this.menuField.addChild(this.menuTextScore);

    // checkbox
    this.checkboxMenu = new RadioGroup({
      items: [
        new CheckBox({ style: { unchecked: this.uncheckedTex, checked: this.checkedTex, text: {
              fontSize: 22,
              fill: '#ffffff'
            } }, text: "Classic" }),
        new CheckBox({ style: { unchecked: this.uncheckedTex, checked: this.checkedTex, text: {
              fontSize: 22,
              fill: '#ffffff'
            } }, text: "No Die" }),
        new CheckBox({ style: { unchecked: this.uncheckedTex, checked: this.checkedTex, text: {
              fontSize: 22,
              fill: '#ffffff'
            } }, text: "Walls" }),
        new CheckBox({ style: { unchecked: this.uncheckedTex, checked: this.checkedTex, text: {
              fontSize: 22,
              fill: '#ffffff'
            } }, text: "Portal" }),
        new CheckBox({ style: { unchecked: this.uncheckedTex, checked: this.checkedTex, text: {
              fontSize: 22,
              fill: '#ffffff'
            } }, text: "Speed" }),
      ],
      type: 'vertical'
    });
    this.menuField.addChild(this.checkboxMenu);
    this.checkboxMenu.x = this.menuField.x+20;
    this.checkboxMenu.y = this.menuField.height/2;
    this.checkboxMenu.onChange.connect((selItem)=>{
      this.mode = selItem;
    });

    // Buttons
    this.buttonStart = createButton('Start');
    this.buttonStart.x = this.menuField.x+15;
    this.buttonStart.y = this.menuField.height-100;

    this.buttonExit = createButton('Exit');
    this.buttonExit.x = this.menuField.x+150;
    this.buttonExit.y = this.menuField.height-100;

    this.buttonStart.on('pointerdown', () => this.start());
    this.buttonExit.on('pointerdown', () => {
     // document.getElementById("pixi-container").style.display = "none";
      window.close();
    });

   this.menuField.addChild(this.buttonExit);
    this.menuField.addChild(this.buttonStart);
  }
  destroyMenuElems(){
    //this.checkboxMenu.destroy({ children: true, texture: true, });
    // this.buttonStart.destroy({ children: true });
    // this.buttonExit.destroy({ children: true });
    this.menuField.children.forEach(child => {
      if (child.destroy) {
        child.destroy({ children: true });
      }
    });
  }

  destroyPlayMenuElems(){
    this.buttonMenu.destroy({ children: true });
    this.menuField.children.forEach(child => {
      if (child.destroy) {
        child.destroy({ children: true });
      }
    });
  }

  init(){
    //this.fieldContainer = new Container();
    this.menuContainer = new Container();
    this.menuContainer.x = 600;

    this.menuField = new Graphics();
    this.menuContainer.addChild(this.menuField);
    this.createMenu();

    this.startScreen();
  }
  getFieldContainer(){
    return this.field.container;
  }

  getMenuContainer(){
    return this.menuContainer;
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
