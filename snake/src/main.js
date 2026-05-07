import { Application, Container, Graphics, BitmapText, Assets } from "pixi.js";
import { RadioGroup, CheckBox } from '@pixi/ui';
import { createButton } from './button.js'
import Game, { Field, Snake, Food, Cell } from "./game.js";

(async () => {
  // Create a new application
  const app = new Application();
  globalThis.__PIXI_APP__ = app;
  // Initialize the application
  await app.init({ background: '#937c7c', resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container").appendChild(app.canvas);
  // Create and add a container to the stage
  const baseContainer = new Container();
  app.stage.addChild(baseContainer);

  const fieldContainer = new Container();
  const menuContainer = new Container();

  baseContainer.addChild(menuContainer);

  const menuField = new Graphics();
  menuField.rect(0,0,300, 600).fill('#087c80');
  menuContainer.addChild(menuField);
  menuContainer.width = menuField.width;



  // Move the container to the center
  baseContainer.x = app.screen.width / 2;
  baseContainer.y = app.screen.height / 2;

  menuContainer.x = 600; //HARDCODE

  baseContainer.width = fieldContainer.width+menuContainer.width;
  baseContainer.pivot.x = baseContainer.width/2;
  baseContainer.pivot.y = baseContainer.height / 2;

  app.stage.addChild(baseContainer);

  // menu elements

  const gameNameTitle = new BitmapText({
    text: 'Snake Game',
    style: {
      fontFamily: 'Custom',
      fontSize: 20,
      fill: '#61c65d',
      align: 'center',
    },
    scale: 2,
    anchor: 0.5,
    position: { x: menuContainer.width / 2, y: menuContainer.height / 15},
  });
  menuField.addChild(gameNameTitle);

  const menuRectBest = new Graphics();
  menuRectBest.rect(0,0, menuField.width, menuField.height/10)
    .fill('#215b60');
  menuField.addChild(menuRectBest);
  menuRectBest.y = menuField.height/5;

  const menuTextBest = new BitmapText({
    text: 'Best: 0',
    style: {
      fontFamily: 'Custom',
      fontSize: 20,
      fill: '#ffffff',
      align: 'center',
    },
    scale: 2,
    anchor: 0.5,
    position: { x: menuContainer.width / 2, y: menuContainer.height / 4},
  })
  menuField.addChild(menuTextBest);


  const menuRectScore = new Graphics();
  menuRectScore.rect(0,0, menuField.width, menuField.height/10)
    .fill('#215b60');
  menuField.addChild(menuRectScore);
  menuRectScore.y = menuField.height/3;

  const menuTextScore = new BitmapText({
    text: 'Score: 0',
    style: {
      fontFamily: 'Custom',
      fontSize: 20,
      fill: '#ffffff',
      align: 'center',
    },
    scale: 2,
    anchor: 0.5,
    position: { x: menuContainer.width / 2, y: menuContainer.height / 2.59},
  })
  menuField.addChild(menuTextScore);

  // checkbox
  const uncheckedTex = await Assets.load("check0.png");
  const checkedTex = await Assets.load("checkbox1.png");

  const checkboxMenu = new RadioGroup({
    items: [
      new CheckBox({ style: { unchecked: uncheckedTex, checked: checkedTex, text: {
            fontSize: 22,
            fill: '#ffffff'
          } }, text: "Classic" }),
      new CheckBox({ style: { unchecked: uncheckedTex, checked: checkedTex, text: {
            fontSize: 22,
            fill: '#ffffff'
          } }, text: "No Die" }),
      new CheckBox({ style: { unchecked: uncheckedTex, checked: checkedTex, text: {
            fontSize: 22,
            fill: '#ffffff'
          } }, text: "Walls" }),
      new CheckBox({ style: { unchecked: uncheckedTex, checked: checkedTex, text: {
            fontSize: 22,
            fill: '#ffffff'
          } }, text: "Portal" }),
      new CheckBox({ style: { unchecked: uncheckedTex, checked: checkedTex, text: {
            fontSize: 22,
            fill: '#ffffff'
          } }, text: "Speed" }),
    ],
      type: 'vertical'
  });
  menuContainer.addChild(checkboxMenu);

  checkboxMenu.x = checkboxMenu.x+20;
  checkboxMenu.y = menuContainer.height/2;

  checkboxMenu.onChange.connect((selItem)=>{
    console.log('id: ',selItem);
  });

  // Buttons
  const buttonStart = createButton('Start');
  checkboxMenu.addChild(buttonStart);
  buttonStart.x = checkboxMenu.x-20;
  buttonStart.y = checkboxMenu.height/0.7;

  const buttonExit = createButton('Exit');
  buttonExit.x = checkboxMenu.x+120;
  buttonExit.y = checkboxMenu.height/1.172;
  checkboxMenu.addChild(buttonExit);


  const myGame = new Game(
    new Field(20,20),
    new Snake(),
    new Food(),
    fieldContainer,
    app
  );

 myGame.start();

  baseContainer.addChild(fieldContainer);
  // fieldContainer.x = baseContainer.x;
  // fieldContainer.y = baseContainer.y;
  // fieldContainer.pivot.y = 300;
  // fieldContainer.pivot.x = 450;
})();
