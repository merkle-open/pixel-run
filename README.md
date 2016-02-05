## TOC

* [About](#about)
    * [Launch](#launch)
    * [Build](#build)
    * [Validation](#jshint)
    * [Dependencies](#dependencies)
* [License](#license)
* [API](#api)
    * [Classes](#classes)
        * [Player](#player)
        * [Tilemap](#tilemap)
        * [Sprite](#sprite)
        * ScoreText
    * [Phaser States](#phaser-states)
    * [Emergency](#emergency)


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

#### JSHint
There's a gulp task integrated which helps you to lint the application files under <code>/app</code>. Simply
run the task <code>lint</code> to validate all the files and generating an output.

> If there's a warning/info *"ES5 option is now set per default"* you can ignore this message
and just keep on reading. This message will be removed in a newer version of JSHint and is generated
due the <code>esversion</code> in the [.jshintrc](https://github.com/janbiasi/pixelrun/blob/master/.jshintrc#L7) is set
to 5 (using ECMAScript 5).

#### Dependencies
* Gulp *(NPM)*
* Phaser *(Bower)*
* ~~jQuery *(Bower)*~~
* BrowserStorage *(NPM)*

## License
[MIT Licensed](LICENSE) by [Namics AG](http://namics.com/).

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

###### init
Initializes the player with arcade physics and collision settings. Must be called before any other function to work in the game!

```js
Player.init()
```

###### collide
Adds a collision handler between the player and another target element defined before.
```js
Player.collide(target: Phaser.Tilemap [, die: Function])
```

###### run
Let the player run on the x-axis with the speed defined in the global settings
```js
Player.run()
```

###### jump
Let the player jump with the velocity set in the global settings. Auto-checks if the body
is on the floor right then to provide a save jump.
```js
Player.jump()
```

#### Tilemap
Creates and handles tilemaps in an easy way.

##### Signature
```js
new Factory.Tilemap(game: Phaser.Game, name: String): Tilemap
```

##### Methods

###### addImage
Adds a new tileset image for placing in the tilemap
```js
Tilemap.addImage(key: String, asset: String)
```

###### addToGame
Adds the tilemap to the game (resp. injecting into it) given to the constructor or uses the parameter as injector point.
```js
Tilemap.addToGame([game: Phaser.Game])
```

###### createLayer
Creates a layer defined in the tilemap.
```js
Tilemap.createLayer(layer: String): TilemapLayer
```

###### setCollision
Sets resp. enable the collision on a specific layer.
```js
Tilemap.setCollision(layer: String, start: Number, end: Number)
```

###### resize
Resizes the game to fit a specific layer.
```js
Tilemap.resize(layer: String)
```

#### Sprite
Creates spritesheet for background images and other images positioned in the game with absolute coordinates (x and y).

##### Signature
```js
new Factory.Sprite(game: Phaser.Game, key: String): Sprite
```

###### add
Adds the spritesheet to a certain position in the game.
```js
Sprite.add(x: Number, y: Number)
```

### Phaser States

#### States
There are four general states avaible which are used for the game process. The Preload, Boot, Game and Update
state. Read more about the states in the chapters below.

##### Boot
The boot state loads all image, sprites and audio assets in the preload function and
sets the basic [game settings](https://github.com/janbiasi/tun-ostschweiz/blob/master/app/settings.js#L4)
in the create method. Define new media elements to get loaded within the [world settings](https://github.com/janbiasi/pixelrun/blob/master/app/provider/settings.js#L51).

##### Preload
Used for pregame settings such as the game mode of phaser (Arcade in this case) and background settings ect. Visit
the default settings [here](https://github.com/janbiasi/tun-ostschweiz/blob/master/app/states/preload.js).

##### Game
Main game process, uses the [game settings](https://github.com/janbiasi/tun-ostschweiz/blob/master/app/settings.js#L4) and
the utility stuff. If you want to change something in the Jump N Run game itself, you'll have to change it [here](https://github.com/janbiasi/tun-ostschweiz/blob/master/app/states/game.js).

##### Store
Used for saving and persisting the highscores of the players. There are two main methods with a short example below.

```js
Container.Store.score('Max Mustermann', 891, 'Map 1');
Container.Store.score('Hans Ruedi', 12, 'Map 1');
Container.Store.getHighscore(); // 891
Container.Store.getHighscore(true); // { score: 891, holder: 'Max Mustermann', map: 'Map 1' }
```

### Emergency
Sometimes you want to kill all players in the world or even quit the game itself due some
unexpected bugs or lags. But you will loose the player scores if you just reload the browser window (press F5), so it
is **not recommended to reload the page to exit**! There are two methods provided as soon as the game starts,
they are located under the global <code>Emergency</code> object. Each method has to be confirmed with the yes button before
it will affect your current game.

#### $killAll
This method will kill all alive players in your game, e.g. if one player lasts in the game and he hang up in an obstacle on the map
and can't move further, this method will be great to kill him (or just use the one below).

```js
Emergency.$killAll()
```

#### $quit
This method will use the <code>$killAll</code> method and additionally exits the game, saves the scores and display
the overview like every player would die.

```js
Emergency.$quit()
```
