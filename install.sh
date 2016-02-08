#!/bin/sh

ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

brew install node

npm install -g gulp
npm install -g pm2
npm install -g bower

npm install ./
bower install ./

npm run serve
