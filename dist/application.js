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
        Root._config.debug = backup ? (backup.debug || false) : false;
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

(function(window) {
    'use strict';

    // Before application is loaded

})(window);

(function(window, undefined) {
    'use strict';

    Root.Util = Root.$createModule('util', function(App) {
        console.log('Loading module %s ...', this.name);

        function Replacer(input, data) {
            this.input = input;
            this.data = data;
            return this;
        }

        Replacer.prototype = {
            replace: function(data) {
                var result = this.input;
                if(data === undefined) {
                    data = this.data;
                }
                var keys = Object.keys(data);
                keys.forEach(function(key) {
                    result = result.replace('{' + key + '}', data[key]);
                });
                return result;
            }
        };

        this.Replacer = Replacer;
        this.$createReplacer = function(input, data) {
            return new Replacer(input, data);
        };

        this.clone = function(obj) {
            if (!obj || typeof obj !== 'object') {
                return obj;
            }
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr) && attr !== '_saveState') {
                    copy[attr] = obj[attr];
                }
            }
            return copy;
        }
    });

})(window);

(function(window, undefined) {
    'use strict';

    Root.Game = Root.$createModule('game', {
        width: '100%',
        height: '100%',
        mode: 'AUTO',
        id: 'canvas-game',
        hud: {
            scoreText: 'Score: {count}',
            collectPoints: 10
        }
    }, function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;
        var conf = module.settings;

        var game = new Phaser.Game(conf.width, conf.height, Phaser[conf.mode], conf.id, {
            preload: App.Media.init,
            create: App.World.init,
            update: App.Renderer.init
        });

        // Initialize the main interface
        Root.HUD.init();

        this.get = function() {
            // Encapsulate the game Object
            return game;
        };

        this.$node = $('#' + conf.id);

    });

})(window);

(function(window, undefined) {
   'use strict';

   Root.HUD = Root.$createModule('hud', {

   }, function(App) {
       console.log('Loading module %s ...', this.name);

       var module = this;

       module.init = function() {
           module.fullScreenBanner();
       };

       module.fullScreenBanner = function() {
           var $banner = $('.hud-fullscreen-banner');
           var $close = $banner.find('.action-close');
           var $fullscreen = $banner.find('.action-open');

           $fullscreen.on('click', function() {
               fullScreen(Root.Game.$node[0]);
           });

           $close.on('click', function() {
               $banner.slideUp();
           });
       };

   });

})(window);

(function(window, undefined) {
    'use strict';

    Root.Media = Root.$createModule('media', {

    }, function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;

        module.init = function() {
            // Initialize
        };
    });

})(window);

(function(window, undefined) {
    'use strict';

    Root.Renderer = Root.$createModule('renderer', function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;

        module.init = function() {
            // Initialize
        };

    });

})(window);

 (function(window, undefined) {
    'use strict';

    Root.World = Root.$createModule('world', {

    }, function(App) {
        console.log('Loading module %s ...', this.name);

        var module = this;

        module.init = function() {
            // Initialize
        };

    });

})(window);

$(document).ready(function() {
    'use strict';

    if (
        document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled
    ) {
        window.fullScreen = function(node) {
            if (node.requestFullscreen) {
                node.requestFullscreen();
            } else if (node.webkitRequestFullscreen) {
                node.webkitRequestFullscreen();
            } else if (node.mozRequestFullScreen) {
                node.mozRequestFullScreen();
            } else if (node.msRequestFullscreen) {
                node.msRequestFullscreen();
            }
        }
    }
});
