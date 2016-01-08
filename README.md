## About

#### Launch

The game can be started over your systems CLI, the only requirement is, that Node.js 4.+ is installed on your machine. Run the command below and see the magic.

```bash
npm run serve
```

#### Dependencies
* Gulp
* Phaser
* jQuery

## License
[MIT License](LICENSE)

## API

#### $createModule

```js
Root.Example = Root.$createModule('example', function(App) {
    /**
     * You can access the current module via `this` and
     * use all other modules via App.<module>
     */

    if(App.World.load()) {
        this.worldLoaded = true;
    }
});
```

#### $start

```js
/**
 * You can pass an array with arguments to the $start
 * method, which defines the order in which the factories
 * will be initialized.
 */

var order = [
    'first',
    'second',
    'last'
];

Root.$start(order);

```
