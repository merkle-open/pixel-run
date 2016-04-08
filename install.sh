#!/bin/sh

# make sure base path exists
mkdir -p ./com/namics/pixel-run
cd ./com/namics

# download game and unpack it
curl -s -O ./pixel-run-master.zip https://codeload.github.com/janbiasi/pixel-run/zip/master
unzip -v ./pixel-run-master.zip -d ./pixel-run

# go to extracted files
cd pixel-run

# installing dependencies
npm install ./
bower install

# run the game
npm start
