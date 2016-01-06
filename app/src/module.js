(function(window, undefined) {
    'use strict';

    var globalApplication = undefined;
    if(window.App) {
        var windowApplication = window.App;
    }

    var App = window.App = {};

    App._config = {
        autostart: false,
        autoregister: false,
        debug: {
            enabled: true,
            history: []
        }
    };

    App._init = function() {
        App.queue = {};
        App.debug = {};
        App.modules = {};
    };

    App._reset = function() {
        App.queue = {};
        App.modules = {};
        App._config.debug.history = [];
    };

    App._init();

    App.giveBack = function() {
        return globalApplication;
    };

    App._logProvider = function() {
        App._config.debug.history.push(arguments);
        return App._config.debug.enabled;
    };

    ['log', 'error', 'warn', 'info'].forEach(function(type) {
        App.debug[type] = function() {
            if(App._logProvider(arguments)) {
                if(!console[type]) {
                    type = 'log';
                }
                window.console[type].apply(console, arguments);
            }
        };
    });

    App.register = function(name, settings, factory) {
        App.debug.log('Registering Module "%s" ...', name);
        if(factory === undefined) {
            factory = settings;
            settings = {};
        }

        App.modules[name] = {
            settings: settings
        };

        App.queue[name] = {
            name: name,
            dependencies: settings.dependencies || [],
            done: false,
            factory: factory
        };
    };

    App.loadModules = function() {
        var queue = App.queue;
        var modules = App.modules;

        for(var name in queue) {
            var mod = queue[name];
            if(mod.dependencies.length <= 0) {
                try {
                    queue[name].factory(modules[name]);
                    App.debug.log('Loaded module "%s"!', name);
                    delete queue[name];
                } catch(notLoaded) {
                    App.debug.error('Couldn\'t load module %s: %s', name, notLoaded.message);
                }
            }
        }
    };

    App.resolveDependency = function(component) {
        App.debug.info('Resolving %s -> [%s]', component.name, component.dependencies.toString());
        if(!component.dependencies || component.dependencies.length <= 0) {
            if(App.modules[component]) {
                App.debug.log('Module %s already loaded, done!', component);
                return true;
            } else {
                try {
                    App.queue[component].factory(App.modules[component]);
                    delete App.queue[component];
                    App.debug.log('Module %s was loaded successfully!', component);
                } catch(failed) {
                    App.debug.error('Loading factory of %s failed: %s', component, failed.message);
                }
            }
        } else {
            component.dependencies.forEach(function(dependency) {
                if(App.modules[dependency]) {
                    App.debug.log('Dependency %s already loaded, skipping ...', dependency);
                } else {
                    App.resolveDependency(dependency);
                }
            });

            try {
                App.queue[component.name].factory(App.modules[component.name]);
                delete App.queue[component.name];
                App.debug.log('Module %s was loaded successfully!', component.name);
            } catch(failed) {
                App.debug.error('Loading factory of %s failed: %s', component.name, failed.message);
            }
        }
    };

    App.unregister = function(name) {
        App.debug.log('Unregistering "%s"...', name);
        try {
            delete App.queue[name];
            delete App.modules[name];
            App.debug.log('Module %s unregistered!', name);
        } catch(failed) {
            App.debug.error('Failed to unregister %s: %s', name, failed.message);
        }
    };

    App.start = function() {
        App.debug.info('Application is starting ...');
        App.loadModules();
        for(var name in App.queue) {
            App.resolveDependency(App.queue[name]);
        }
    };

    App.stop = function(reason) {
        App.debug.info('Application is shutting down %s...', (reason ? reason + ' ' : ' '));
        App._reset();
        App.debug.log('Goodbye!');
    };

    window.App = App;

})(window);
