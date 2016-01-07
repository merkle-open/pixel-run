(function(window, undefined) {
    'use strict';

    var backup = window.Root || undefined;
    var Root = window.Root = {
        _modules: {},
        _factory: {}
    };

    if(!Root.debug && window.console !== undefined) {
        ['log', 'warn', 'info', 'error'].forEach(function(type) {
            window.console[type] = function() {
                // Disable logging if not in debug mode
            }
        });
    }

    // Gets the old Root object before running this app
    Root.$giveBack = function() {
        return backup;
    };

    Root.$createModule = function(name, settings, factory) {
        var instance = new GameModule(name, settings, factory);
        Root._modules[name] = instance;
        return instance;
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
        this.factory = factory;
    };

    GameModule.prototype = {
        init: function() {

        },
        reload: function() {

        }
    };

    Root._factory.Module = GameModule;
    window.Root = Root;
})(window);
