# hearthtunnel

A Hearthstone deck tracker application created using [nw.js](http://nwjs.io/).

> NOTE: This application is still very much in development. Please be aware that some of the steps below may be broken. I put a lot of thought into the development and deployment workflow so the steps shouldn't change much, if at all, but the code isn't finished and the app currently doesn't do much aside from compile and show "hello world" :P

## Installers

> Coming soon...

## Install

1. Clone the repository.

   > $ git clone https://github.com/chevex/hearthtunnel.git

2. Install node from within the project directory.

   > $ npm install

3. Build project assets using [gulp](http://gulpjs.com/).

   > $ gulp build

## Run

> $ npm start

After you have hacked on the project, if you would like to submit any changes back to the official repository, please fork this repository and submit pull requests.

## Livereload

If you're contributing to the hearthtunnel project and are sick of typing `gulp` and reloading the app over and over again, there is a `watch` task in the gulpfile.

> $ gulp watch

When you run this task it will run the default gulp task and build the project's assets like normal. However, instead of returning to the terminal afterward, it will start a livereload server and begin monitoring all Jade, JavaScript, and Stylus files for changes. When changes are detected it will trigger the appropriate gulp tasks and reload the appliation assets in realtime :D

## Deployment

If you want to build the complete project and get binaries for Windows and OS X, just use the deploy task.

> $ gulp deploy

It will run the default gulp task, build all the assets like normal, and then it will run the entire app through [node-webkit-builder](https://github.com/mllrsohn/node-webkit-builder) and generate 32 and 64 bit executables for both operating systems. The built executables will then be found in the root of the project in a "release" directory.
