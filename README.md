# Hearthpal Tracker

A Hearthstone deck tracker application created using [nw.js](http://nwjs.io/).

> NOTE: This application is in beta. If you encounter any trouble with it please come back and leave an issue in our [issue tracker](https://github.com/hearthpal/hearthpal-tracker/issues). If you're a savvy node developer then you're also welcome to submit [pull requests](https://github.com/hearthpal/hearthpal-tracker/pulls).

> I'm especially looking for people to test on Windows. I'm on a Macbook Pro myself and have not tested this on Windows at all. It is designed to work with Windows but there may be bugs in need of being ironed out.

## Installers

> Coming soon...

## Install

1. Clone the repository.

   > $ git clone https://github.com/hearthpal/hearthpal-tracker.git

2. Install dependencies.

   > $ npm install
   
3. Install ImageMagick so that gulp can crop the Hearthstone card image files.

   **Mac OSX:**  
   > $ brew install imagemagick
   
   **Windows:**  
   http://www.imagemagick.org/script/binary-releases.php

4. Build project assets using [gulp](http://gulpjs.com/). (`npm install gulp -g`)

   > $ gulp build

## Run

> $ npm start

After you have hacked on the project, if you would like to submit any changes back to the official repository, please fork this repository and submit pull requests.

## Livereload

If you're contributing to the hearthpal tracker project and are sick of typing `gulp` and reloading the app over and over again, there is a `watch` task in the gulpfile.

> $ gulp watch

Run this after running `gulp build` and it will start a livereload server. It will begin monitoring all Jade, JavaScript, and Stylus files for changes. When changes are detected it will trigger the appropriate gulp tasks and reload the appliation assets in realtime; you don't even need to restart the app in most cases.

## Deployment

If you want to build the complete project and get binaries for Windows and OS X, just use the deploy task.

> $ gulp deploy

It will run the default gulp task, build all the assets like normal, and then it will run the entire app through [node-webkit-builder](https://github.com/mllrsohn/node-webkit-builder) and generate 32 and 64 bit executables for both operating systems. The built executables will then be found in the root of the project in a "release" directory.

> NOTE: I recently discovered that the deploy task doesn't work on the latest versions of node or iojs. Install node 0.10.x, then run the deploy task and it should work.

## Frequently Asked Questions

#### Q. Where's my stats!?

A. There aren't any.....yet! Ultimately the Hearthpal Tracker is meant to be part of a much larger undertaking. I'm not ready to announce anything yet but rest assured that I'm hard at work bringing you new goodies :)

#### Q. My decks got wiped out!

A. At the moment all your decks are saved right inside the tracker's own application directory. This means that if you download a new version of the app then the directory gets wiped out. I know it's super irritating and you can be sure I'm working on storing them in a safer location on your machine that won't get blown away all the time. There are a few other things to implement before I can get there so all I ask is that you be patient for now :)

#### Q. Why isn't the tracker *stacking* Imps? Sometimes they appear stacked on the list, and other times they appear multiple times on the list.

A. Please see [this issue](https://github.com/hearthpal/hearthpal-tracker/issues/1).
