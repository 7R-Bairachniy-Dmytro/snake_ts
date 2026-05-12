import * as PIXI from 'pixi.js';
import {BitmapText} from "pixi.js";

export function createButton(label, width = 120, height = 40, bgColor = 'rgb(24 83 43)', textColor = '#ffffff') {
  const button = new PIXI.Container();

  const background = new PIXI.Graphics();
  background.fill(bgColor);
  background.roundRect(0, 0, width, height, 8);
  background.endFill();
  button.addChild(background);

  const text =new BitmapText({
    text: label,
    style: {
      fontFamily: 'Custom',
      fontSize: 18,
      fill: '#ffffff',
      align: 'center',
    },
    scale: 2,
    anchor: 0.5,
  })
  text.anchor.set(0.5);
  text.x = width / 2;
  text.y = height / 2;
  button.addChild(text);

  button.interactive = true;
  button.buttonMode = true;

  return button;
}
