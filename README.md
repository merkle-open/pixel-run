# Pixel-Run

Pixel-Run is a jump and run game developed and maintained by Namics' trainees.

## Run

To run the pixel run server you first have to build the client application. There is a server running Express which serves the game app and handles the scores sent by the game in the browser.

### Install

To install and run the game on your by your own clone this repository and install all dependencies.

```bash
yarn install
```

## Env variables to set

Some environmental variables are needed in order to build the game.

| Key                | Value                                                         |
| ------------------ | ------------------------------------------------------------- |
| HOST (required)    | the local hostname                                            |
| JUMP_ON (required) | **push** to jump on keypress and **release** to jump on keyup |
| PORT               | Port default is **3000**                                      |

### Build

To build for production use the `build` task.

```bash
yarn build
```

### Start Server

To start the server run the command

```bash
yarn start
```

> Before starting the live server you have the build the React app otherwise nothing is displayed.

## Contributing

### Development Server

For development there is a `dev` task which runs webpack with a watcher side by side with the express server.

```bash
yarn dev
```

For development build only use the `build:dev` task

```bash
yarn build:dev
```

### Run tests

To run the Jest tests run

```bash
 yarn test
```
