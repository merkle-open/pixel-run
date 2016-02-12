#!/bin/sh
# automatied installer for pixelrun

# install homebrew package manager
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# install latest node.js version
brew install node

# install global modules needed
npm install -g gulp
npm install -g pm2
npm install -g bower

# installing all dependencies
npm install ./
bower install ./

# build the assets and app files
gulp build:start && gulp build:default

# starting the server
npm run serve
