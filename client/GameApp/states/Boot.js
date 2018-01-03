import store from "../redux/store";
// TODO remove this and use dynamic imports
// when phaser supports operations with promises
import tilemapSpace from "../assets/img/world/space/tilemap-space.json";
import tilemapCandy from "../assets/img/world/candy/tilemap-candy.json";
import tilemapSnow from "../assets/img/world/snow/tilemap-snow.json";

import tileSpace from "../assets/img/world/space/tiles/tile-space.png";
import tileCandy from "../assets/img/world/candy/tiles/tile-candy.png";
import tileSnow from "../assets/img/world/snow/tiles/tile-snow.png";

import backgroundSpace from "../assets/img/backgrounds/background-space.png";
import backgroundCandy from "../assets/img/backgrounds/background-candy.png";
import backgroundSnow from "../assets/img/backgrounds/background-snow.png";

import techieSpace from "../assets/img/avatars/space/avatar-space-techie.png";
import techieCandy from "../assets/img/avatars/candy/avatar-candy-techie.png";
import techieSnow from "../assets/img/avatars/snow/avatar-snow-techie.png";

import consultantSpace from "../assets/img/avatars/space/avatar-space-consultant.png";
import consultantCandy from "../assets/img/avatars/candy/avatar-candy-consultant.png";
import consultantSnow from "../assets/img/avatars/snow/avatar-snow-consultant.png";

import designerSpace from "../assets/img/avatars/space/avatar-space-designer.png";
import designerCandy from "../assets/img/avatars/candy/avatar-candy-designer.png";
import designerSnow from "../assets/img/avatars/snow/avatar-snow-designer.png";

import jumpSound from "../assets/audio/fx/jump.mp3";
import dieSound from "../assets/audio/fx/die.mp3";

const tileMaps = {
  space: tilemapSpace,
  candy: tilemapCandy,
  snow: tilemapSnow
};

const tiles = {
  space: tileSpace,
  candy: tileCandy,
  snow: tileSnow
};

const backgrounds = {
  space: backgroundSpace,
  candy: backgroundCandy,
  snow: backgroundSnow
};

const techies = {
  space: techieSpace,
  candy: techieCandy,
  snow: techieSnow
};

const consultants = {
  space: consultantSpace,
  candy: consultantCandy,
  snow: consultantSnow
};

const designer = {
  space: designerSpace,
  candy: designerCandy,
  snow: designerSnow
};

class Boot {
  preload() {
    // Load worlds and audio effects
    this.$loadWorldDependencies();
    this.$loadAudioFX();
  }

  /**
   * Start the preloader state
   */
  create() {
    this.state.start("Preload");
  }

  /**
   * Load all dependencies for all worlds saved under settings
   */
  $loadWorldDependencies() {
    const worldKey = store.getState().world;
    this.load.tilemap(
      `tilemap-${worldKey}`,
      tileMaps[worldKey],
      null,
      Phaser.Tilemap.TILED_JSON
    );
    this.load.image(`background-${worldKey}`, backgrounds[worldKey]);
    this.load.image(`tile-${worldKey}`, tiles[worldKey]);
    this.load.image(`avatar-${worldKey}-consultant`, consultants[worldKey]);
    this.load.image(`avatar-${worldKey}-techie`, techies[worldKey]);
    this.load.image(`avatar-${worldKey}-designer`, designer[worldKey]);
  }

  /**
   * Load all audio effects and samples
   */
  $loadAudioFX() {
    this.load.audio("fx-jump", jumpSound);
    this.load.audio("fx-die", dieSound);
  }
}

export default Boot;
