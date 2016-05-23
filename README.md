## Table of Contents

* [About](#about)
    * [Launch](#start)
    * [Build](https://github.com/janbiasi/pixel-run/tree/docs/Build.md)
    * [Validation](https://github.com/janbiasi/pixel-run/tree/docs/Build.md#jshint)
    * [Dependencies](#main-dependencies)
    * [Mirror](#mirror-this-repository)
* [License](#license)
* [API](https://github.com/janbiasi/pixel-run/tree/docs/API.md)
    * [Classes](https://github.com/janbiasi/pixel-run/tree/docs/API.md#classes)
        * [Player](https://github.com/janbiasi/pixel-run/tree/docs/API.md#player)
        * [Tilemap](https://github.com/janbiasi/pixel-run/tree/docs/API.md#tilemap)
        * [Sprite](https://github.com/janbiasi/pixel-run/tree/docs/API.md#sprite)
    * [Phaser States](https://github.com/janbiasi/pixel-run/tree/docs/States.md)
    * [Emergency](https://github.com/janbiasi/pixel-run/tree/docs/API.md#emergency)
* [Creator](https://github.com/janbiasi/pixel-run/tree/docs/Creator.md)
    * [Edit Worlds](https://github.com/janbiasi/pixel-run/tree/docs/Creator.md#edit-world)
    * [Custom Tilemap](https://github.com/janbiasi/pixel-run/tree/docs/Creator.md#custom-tilemap)
* [FAQ](https://github.com/janbiasi/pixel-run/tree/docs/FAQ.md)


## About

#### Master Version (OFFA)
The latest release for demonstration or showcases is located
in the branch <code>[master](https://git.namics.com/namics/pixel-run/tree/master)</code>

#### Standalone Version (Tilemap Editing)
The standalone version is located in the branch <code>[creator](https://git.namics.com/namics/pixel-run/tree/creator)</code>

#### Online Version (pixelrun.namics.com)
The online version with more content and deployment environement is located
in the branch <code>[online](https://git.namics.com/namics/pixel-run/tree/online)</code>

#### Documentations
All documents related to this program/game are located in the branch
<code>[docs](https://git.namics.com/namics/pixel-run/tree/docs)</code>

## Start

The game can be started over your systems CLI, the only requirement is, that Node.js 4.+ is installed on your machine. Run the command below and see the magic.

    npm start

## Main Dependencies
* Gulp *(NPM)*
* Express *(NPM)*
* Shipit *(NPM)*
* Phaser *(Bower)*
* jQuery *(Bower)*
* ~~BrowserStorage *(NPM)*~~

## Mirror this Repository

If you would like to push all the content from our [internal GitLab repository](https://git.namics.com/namics/pixel-run/) to this public GitHub Repository, you have to add a new remot to your git project configuration. Append these lines below to your file under <code>/pixel-run/.git/index</code> and follow the commands.

```config
[remote "github"]
	url = https://github.com/namics/pixel-run.git
	fetch = +refs/heads/*:refs/remotes/mirror/*
   fetch = +refs/tags/*:refs/tags/*
```

And do this afterwards

```bash
# execute this command after adjusting your configuration
git push --mirror github
```

## License
[MIT Licensed](LICENSE) by [Namics AG](http://namics.com/).
