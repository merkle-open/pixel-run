
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
