(function(window, undefined) {
    'use strict';

    var moduleIdentifier = 1;
    var backup = window.Root || undefined;
    var Root = window.Root = {
        _modules: {},
        _factory: {},
        _config: {}
    };

    Root.$$defaults = function() {
        Root._config.debug = backup.debug || false;
    };

    Root.$$factory = function() {
        // Publish the GameModule
        Root._factory.Module = GameModule;

        // Setting Debug Mode
        if(!Root._config.debug && window.console !== undefined) {
            ['log', 'warn', 'info', 'error'].forEach(function(type) {
                window.console[type] = function() {
                    // Disable logging if not in debug mode
                }
            });
        }
    };

    // Gets the old Root object before running this app
    Root.$giveBack = function() {
        return backup;
    };

    Root.$configure = function(key, value) {
        Root._config[key] = value;
    };

    Root.$enable = function(key) {
        Root._config[key] = true;
    };

    Root.$disable = function(key) {
        Root._config[key] = false;
    };

    Root.$createModule = function(name, settings, factory, type) {
        if(type === undefined) {
            type = GameModule;
        }
        var instance = new type(name, settings, factory);
        Root._modules[name] = instance;
        return instance;
    };

    Root.$preload = function(queue) {
        Root._preload = queue;
        return this;
    };

    Root.$start = function(queue) {
        if(Array.isArray(Root._preload)) {
            var preload = Root._preload;
            delete Root._preload;
            Root.$start(preload);
        }
        var modules = Root._modules;
        if(queue === undefined) {
            queue = Object.keys(Root._modules);
        }

        if(!Array.isArray(queue)) {
            throw new Error('No action for $start arguments defined.');
        }

        queue.forEach(function(gameModule) {
            if(!modules[gameModule]) {
                console.warn('Module %s not found, skipping', gameModule);
                return false;
            }

            modules[gameModule].init();
        });
    };

    function GameModule(name, settings, factory) {
        if(typeof name === 'string') {
            if(!factory && settings) {
                factory = settings;
                settings = {};
            }
            settings.name = name;
            name = undefined;
        }

        this.settings = settings;
        this.name = settings.name;
        delete this.settings.name;
        this.factory = factory;
    };

    GameModule.prototype = {
        init: function() {
            this._id = moduleIdentifier++;
            this.factory(Root);
            this._saveState = Root.Util.clone(this);
        },
        reload: function() {
            var saved = this._saveState;
            return Root._modules[this.name] = saved;
        }
    };

    Root.$$defaults();
    Root.$$factory();

    window.Root = Root;
})(window);
