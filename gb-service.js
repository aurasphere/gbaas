import fs from "fs";
import Serverboy from "serverboy";
import GIFEncoder from "gifencoder";
import canvas from "canvas";

const { createCanvas } = canvas;
const rom = fs.readFileSync("./rom.gb");
const saveData = fs.readFileSync("./rom.sav");

const gameboy = new Serverboy();
gameboy.loadRom(rom, saveData);

const gifDurationSeconds = 4;

const service = {
  getScreen: async function () {
    const encoder = new GIFEncoder(160, 144);
    encoder.start();
    encoder.setRepeat(-1); // 0 for repeat, -1 for no-repeat
    encoder.setDelay(1000 / 60); // frame delay in ms (60 fps)
    encoder.setQuality(10);

    const canvas = createCanvas(160, 144);
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < gifDurationSeconds * 30; i++) {
      let screen = gameboy.getScreen();
      let id = ctx.createImageData(160, 144);
      for (let j = 0; j < screen.length; j++) {
        id.data[j] = screen[j];
      }
      ctx.putImageData(id, 0, 0);
      encoder.addFrame(ctx);

      service.secondsForward(1 / 30); // skips 1 frame
    }

    encoder.finish();
    return encoder.out.getData();
  },
  secondsForward: function (seconds = 1) {
    for (let i = 0; i < 60 * seconds; i++) {
      gameboy.doFrame();
    }
  },
  pressKey: function (key) {
    // Keeps the button pressed for 10 frames.
    for (let i = 0; i < 10; i++) {
      gameboy.pressKey(key);
      gameboy.doFrame();
    }
  },
};

service.secondsForward(1);

export default service;
