
import {BitmapText, Container, Graphics} from "pixi.js";

export class Field {
  constructor(size, container) {
    // super();
    this.container = container;
    this.height = size;
    this.width = size;
    this.init()
  }

  init(){
    //this.container = new Container();
    this.cell = new Graphics();
    this.playField = new Graphics();
    this.grid = new Graphics();
    this.container.addChild(this.playField);
    this.container.addChild(this.cell);
    this.container.addChild(this.grid);

    this.gameOverText = new BitmapText()

    this.container.addChild(this.gameOverText);
  }

  get Height() {
    return this.height;
  }

  get Width() {
    return this.width;
  }

  Draw(snake,food,walls,portal){
    this.resetGraphics();

    this.playField.rect(0, 0, 600, 600);
    this.playField.fill('#676767');

    this.container.width = this.playField.width;
    // Create grid background
    const gridSize = 30;
    for (let x = 0; x < this.playField.width; x += gridSize) {
      this.grid.moveTo(x, 0).lineTo(x, this.playField.height);
    }
    for (let y = 0; y < this.playField.height; y += gridSize) {
      this.grid.moveTo(0, y).lineTo(this.playField.width, y);
    }
    this.grid.stroke({ width: 1, color: '#7e7d7d' });


    for (let s=0; s<snake.body.length; s++ ) {
      this.cell.rect(gridSize * snake.body[s].x, gridSize * snake.body[s].y, gridSize, gridSize);
      if ( s===0 ){
        this.cell.fill('#ffffff');
      }else{
        this.cell.fill('#c3ab10');
      }
    }

    //food
    this.cell.rect(gridSize*food.getX(),gridSize*food.getY(),gridSize,gridSize);
    this.cell.fill('#11713b');

    //portal
    if (portal.length>0){
      for ( let i = 0; i < portal.length; i++ ) {
        this.cell.rect(gridSize * portal[i].x, gridSize * portal[i].y, gridSize, gridSize);
        this.cell.fill('#000000');
      }
    }

    //walls
    if (walls.length>0){
      for (let s=0; s<walls.length; s++ ) {
        this.cell.rect(gridSize * walls[s].x, gridSize * walls[s].y, gridSize, gridSize);
        this.cell.fill('#1034c3');
      }
    }
  }

  gameOverScreen(){
    this.playField.rect(0, 0, 600, 600);
    this.playField.fill('#b1afaf');

    this.gameOverText.text = 'GAME OVER';
    this.gameOverText.style = {
      fontFamily: 'Custom',
      fontSize: 20,
      fill: '#e60000',
      align: 'center',
    }
    this.gameOverText.scale = 2;
    this.gameOverText.position = { x: this.container.width / 2, y: this.container.height / 2};
    this.gameOverText.pivot.x = this.gameOverText.width / 4;
    this.gameOverText.pivot.y = this.gameOverText.height / 2;
  }

  resetGraphics(){
    this.playField.clear();
    this.grid.clear();
    this.cell.clear();
    this.gameOverText.text = '';
  }
}
