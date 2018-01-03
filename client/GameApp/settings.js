import spaceWorld from "./assets/img/thumbnails/space.png";
import candyWorld from "./assets/img/thumbnails/candy.png";
import snowWorld from "./assets/img/thumbnails/snow.png";

const settings = {
  debug: true, // DO NOT DISABLE!
  audio: {
    fx: ["jump", "die"]
  },
  render: {
    width: "100%",
    height: 1080,
    mode: "canvas", // Phaser.[VALUE]
    node: "js-launch-phaser-game",
    fontSize: 26
  },
  physics: {
    mode: "arcade", // Phaser.Physics[ARCADE]
    arcadeGravity: 200
  },
  game: {
    deadline: 1000,
    jumpOn: process.env.JUMP_ON, // release or push
    players: {
      height: 160,
      width: 153,
      baseName: "avatar-",
      basePath: "assets/img/avatars/",
      mimeType: "png",
      amount: undefined,
      variations: ["techie", "designer", "consultant"],
      keymap: ["up", "down", "left"],
      bounce: {
        y: 0.2
      },
      gravity: {
        y: 900
      },
      velocity: {
        y: -750,
        x: 450
      }
    }
  },
  scores: {
    limit: 10, // How many entries (-1 equals unlimited)
    refetch: 10 * 1000 // How often the scores should be reloaded
  },
  worlds: [
    // You must insert all worlds here!
    {
      name: "space",
      contrast: "#ffffff",
      colors: ["#50bcff", "#a8c614", "#ff5050"],
      image: spaceWorld
    },
    {
      name: "candy",
      contrast: "#000000",
      colors: ["#50bcff", "#a8c614", "#ff5050"],
      image: candyWorld
    },
    {
      name: "snow",
      contrast: "#000000",
      colors: ["#50bcff", "#a8c614", "#ff5050"],
      image: snowWorld
    }
  ]
};

export default settings;
