
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
