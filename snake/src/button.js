import * as PIXI from 'pixi.js';

export function createButton(label, width = 120, height = 40, bgColor = 0x007bff, textColor = 0xffffff) {
  const button = new PIXI.Container();

  // фон
  const background = new PIXI.Graphics();
  background.beginFill(bgColor);
  background.drawRoundedRect(0, 0, width, height, 8);
  background.endFill();
  button.addChild(background);

  // текст
  const text = new PIXI.Text(label, {
    fontFamily: 'Arial',
    fontSize: 18,
    fill: textColor,
    align: 'center',
  });
  text.anchor.set(0.5);
  text.x = width / 2;
  text.y = height / 2;
  button.addChild(text);

  // интерактивность
  button.interactive = true;
  button.buttonMode = true;

  return button;
}
