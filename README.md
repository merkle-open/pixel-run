## About

#### Launch

The game can be started over your systems CLI, the only requirement is, that Node.js 4.+ is installed on your machine. Run the command below and see the magic.

```bash
npm run serve
```

#### Build
A build can be triggered over your systems CLI like the launch command above. There are several tasks avaible (listed below), but if you want to re-build the whole application, simpy run the <code>gulp</code> command, and everything is done.

```bash
gulp # run whole build

# remove builded files, additionally use :app or
# :dependencies to just remove the related files
gulp clean:dist

# builds the app or dependencies only
gulp build:app
gulp build:dependencies

# watches the app or dependencies and auto-trigger
# the right builds on file changes
gulp watch:app
gulp watch:dependencies
```

#### Dependencies
* Gulp *(NPM)*
* Phaser *(Bower)*
* jQuery *(Bower)*
* BrowserStorage *(NPM)*

## License
[MIT License](LICENSE)

## API

### Classes
Several Classes are used to simplify the logic in the game state. Check out the sections
below to grab some more information about those classes.

> **Attention**, All classes are located under the global <code>Factory</code> Object and **not** under the window object!

#### Player
A player can be instanciated to add a new player to the map which has a dedicated key to jump,
certain X and Y coordinates and a variation (e.g. blue or yellow). It has also a method to jump and
one to die. The class also contains private variables and methods which are recognisable by the dollar sign ($)
at the very start of the variable name.

##### Signature
```js
new Factory.Player(game: Phaser.Game, index: Number, posX: Number, posY: Number [, variation: String]): Player
```

#### Tilemap
Creates and handles tilemaps in an easy way.

##### Signature
```js
new Factory.Tilemap(game: Phaser.game, name: String): Tilemap
```

### Game

#### States
There are four general states avaible which are used for the game process. The Preload, Boot, Game and Update
state. Read more about the states in the chapters below.

##### Boot
The boot state loads all image, sprites and audio assets in the preload function and
sets the basic [game settings](https://github.com/janbiasi/tun-ostschweiz/blob/master/app/settings.js#L4)
in the create method. Define new media elements to get loaded within the [loader variable](https://github.com/janbiasi/tun-ostschweiz/blob/master/app/states/boot.js#L8).

##### Preload
Used for pregame settings such as the game mode of phaser (Arcade in this case) and background settings ect. Visit
the default settings [here](https://github.com/janbiasi/tun-ostschweiz/blob/master/app/states/preload.js).

##### Game
Main game process, uses the [game settings](https://github.com/janbiasi/tun-ostschweiz/blob/master/app/settings.js#L4) and
the utility stuff. If you want to change something in the Jump N Run game itself, you'll have to change it [here](https://github.com/janbiasi/tun-ostschweiz/blob/master/app/states/game.js).

##### Store
Used for saving and persisting the highscores of the players. There are two main methods with a short example below.

```js
Container.Store.score('Max Mustermann', 891);
Container.Store.score('Hans Ruedi', 12);
Container.Store.getHighscore(); // 891
Container.Store.getHighscore(true); // { score: 891, holder: 'Max Mustermann' }
```
