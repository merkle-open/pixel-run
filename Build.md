## Build Process

#### Gulp
A build can be triggered over your systems CLI like the launch command above. There are several tasks avaible (listed below), but if you want to re-build the whole application, simpy run the <code>gulp</code> command, and everything is done.

> To apply settings changed, you have to **rebuild the application**, simply rund the default <code>gulp</code> command to do this.

    gulp # run whole build

    # remove builded files, additionally use :app or
    # :dependencies to just remove the related files
    gulp clean:dist

    # builds the app or dependencies only
    gulp build:app
    gulp build:dependencies

    # watches the app or dependencies and auto-trigger
    # the right builds on file changes
    gulp watch:app
    gulp watch:dependencies

###### Plugins
* gulp@^3.9.0
* gulp-concat@^2.6.0
* gulp-cssmin@^0.1.7
* gulp-gzip@^1.2.0
* gulp-header@^1.7.1
* gulp-if@^2.0.0
* gulp-jshint@^2.0.0
* gulp-rename@^1.2.2
* gulp-uglify@^1.5.1
* gulp-zip@^3.1.0
* jshint@^2.9.1
* mocha@^2.4.5
* morgan@^1.6.1

#### JSHint
There's a gulp task integrated which helps you to lint the application files under <code>/app</code>. Simply
run the task <code>lint</code> to validate all the files and generating an output.

> If there's a warning/info *"ES5 option is now set per default"* you can ignore this message
and just keep on reading. This message will be removed in a newer version of JSHint and is generated
due the <code>esversion</code> in the [.jshintrc](https://github.com/janbiasi/pixel-run/blob/master/.jshintrc) is set to 5 (using ECMAScript 5).
