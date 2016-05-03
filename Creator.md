
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
