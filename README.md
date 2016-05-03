## Table of Contents

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
    * [Phaser States](#phaser-states)
    * [Emergency](#emergency)
* [Creator](#creator)
    * [Edit Worlds](#edit-world)
    * [Custom Tilemap](#custom-tilemap)
* [FAQ](https://github.com/janbiasi/pixel-run/blob/master/FAQ.md)


## About

> The standalone version is located in the branch <code>[creator](https://git.namics.com/jan.biasi/pixel-run/tree/creator)</code>

#### Launch

The game can be started over your systems CLI, the only requirement is, that Node.js 4.+ is installed on your machine. Run the command below and see the magic.

    npm start


#### Build
A build can be triggered over your systems CLI like the launch command above. There are several tasks avaible (listed below), but if you want to re-build the whole application, simpy run the <code>gulp</code> command, and everything is done.

> To apply settings changed, you have to **rebuild the application**, simply rund the default <code>gulp</code> command to do this.

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

#### JSHint
There's a gulp task integrated which helps you to lint the application files under <code>/app</code>. Simply
run the task <code>lint</code> to validate all the files and generating an output.

> If there's a warning/info *"ES5 option is now set per default"* you can ignore this message
and just keep on reading. This message will be removed in a newer version of JSHint and is generated
due the <code>esversion</code> in the [.jshintrc](https://github.com/janbiasi/pixel-run/blob/master/.jshintrc) is set to 5 (using ECMAScript 5).

#### Dependencies
* Gulp *(NPM)*
* Express *(NPM)*
* Shipit *(NPM)*
* Phaser *(Bower)*
* jQuery *(Bower)*
* ~~BrowserStorage *(NPM)*~~

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
sets the basic [game settings](https://github.com/janbiasi/pixel-run/blob/master/app/provider/settings.js)
in the create method. Define new media elements to get loaded within the [world settings](https://github.com/janbiasi/pixel-run/blob/master/app/provider/settings.js#L55).

##### Preload
Used for pregame settings such as the game mode of phaser (Arcade in this case) and background settings ect. Visit the default settings [here](https://github.com/janbiasi/pixel-run/blob/master/app/states/preload.js).

##### Game
Main game process, uses the [game settings](https://github.com/janbiasi/pixel-run/blob/master/app/provider/settings.js) and
the utility stuff. If you want to change something in the Jump N Run game itself, you'll have to change it [here](https://github.com/janbiasi/pixel-run/blob/master/app/states/game.js).

##### Over
This state will show the resume screen with the highscores. Afterwards it will run the **Sync** state.

##### Sync
At least the sync state will synchronize all the player scores to the file <code>/app/data/scores.json</code> via an
AJAX request to <code>HTTP POST /api/save/score</code>.

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

> You can also use the shortcut keycombination <code>Ctrl + Y</code> to quit the game!

```js
Emergency.$quit()
```

## Creator

### Edit World

Players of the game can edit the played world on a second computer. Therefor open up the tilemap <code>project.tmx</code>
located under <code>/worlds/welt1/</code>. Maybe you have to unzip the <code>welt1.zip</code> before and extract the main content
to the folder listed above.

Next up, the players can edit the world in the Tiled Editor installed on the computer. At the end you have to export
the edited map as JSON via <code>Datei > Exportieren als</code> and then select <code>welt1.json</code>.

That's it.

### Custom Tilemap

You can create custom tilemaps with this branch, just open up the tiled editor and do the following.
**Bold** marked sentences or quotes are important things about the current step you're processing.

#### 1. Settings

Create a new tilemap project with the following settings:

| Key          | Value          |
|--------------|----------------|
| Orientation  | Orthogonal     |
| Tile-Layer-Format | CSV         |
| Tile-Drawing-Order | Right Down |
| Tile-Size    | 32px x 32px    |

#### 2. Layers

Create a layer with the name "world" (the name must be world). Layers can be
renamed by double-clicking the layer, default layer name is "Kachelebene 1".

**The layer must fit the name <code>world</code>**

#### 3. Import tile

Import a new tileset by pressing the left button in the right-bottom panel
of your tiled editor. It will ask you for a tile-name and a location. Drag the created
tile which has a size of 32x32px into the right bottom panel and it will auto-fill
the alert-box for you. Press "Ok" to continue then.

**The importet tile must fit the name <code>tile-{{name}}</code>**

#### 4. Draw

Select the importet tile and draw with it in the tiled editor.

#### 5. Export

Export the map by the menu "Datei > Exportieren als ..." and then select JSON.

#### 6. Background

Use an existing background or create one in photoshop together with a designer.

**The background name must fit the name <code>background-{{name}}</code>**

#### 7. Final steps

After this process, place all the files (project file is optional) in a folder called
<code>{{name}}</code>. The name-placeholder will be used to load your custom map. For example;
if you create a folder called "myworld" you have to call the files the following:

* <code>tilemap-myworld.json</code>
* <code>tile-myworld.png</code>
* <code>background-myworld.png</code>
* <code>project.tmx</code> *(optional!)*

Place your world folder in <code>/pixel-run/worlds/{{name}}</code> and start the game!

**The exported filename must fit the convention <code>tilemap-{{name}}</code>**
