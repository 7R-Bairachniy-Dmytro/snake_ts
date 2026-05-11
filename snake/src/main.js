import { Application, Container } from "pixi.js";
import Game, {  Food } from "./game.js";
import {Snake} from "./snake.js";
import {Field} from "./field.js";

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

  const myGame = new Game(
    new Field(20,fieldContainer),
    new Snake(),
    new Food(),
    app
  );

  await myGame.loadData();

  myGame.init();

  baseContainer.addChild(myGame.getFieldContainer());
  baseContainer.addChild(myGame.getMenuContainer());
  // fieldContainer.x = baseContainer.x;
  // fieldContainer.y = baseContainer.y;
  // fieldContainer.pivot.y = 300;
  // fieldContainer.pivot.x = 450;
})();
