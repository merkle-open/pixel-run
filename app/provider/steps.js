/**
 * /app/provider/steps.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    /**
     * Generates steps in a steps container and initialize them,
     * and also stores results under HUD.$store
     * @param {Node} container          HTML .steps container
     */
    function Stepper(container) {
        this.$parent = container;
        this.$steps = container.find('> .step');
        this.$instance = [];
        this.done = false;
    }

    Stepper.prototype = {
        start: function(handler) {
            var self = this;
            self.$callback = handler;

            self.$steps.each(function() {
                var step = new HUD.Factory.Step($(this));

                step.on('finished', function() {
                    self.done = true;
                    (self.$callback || Util.noop)($(self.$steps[self.$steps.length - 1]));
                });

                self.$instance.push(step);
            });
        }
    };

    /**
     * Single step for pregame HUD
     * @param {Node} node           HTML .step node
     */
    function Step(node) {
        this.done = false;
        this.loaded = false;
        this.error = null;
        this.$step = node;
        this.$input = $('.' + node.data('input'));
        this.$next = $('.' + node.data('next'));
        this.$dataKey = this.$input.data('key');
        this.$useDatakey = this.$input.data('use');
        this.$processType = this.$input.data('process');
        this.$continue = node.find('.js-next');
        this.$process = this.$createProcessor();
        this.$handlers = {};
        this.$addEventListeners();

        return this;
    }

    Step.prototype = {
        on: function(ev, handler) {
            this.$handlers[ev] = handler;
        },
        emit: function(ev) {
            this.$handlers[ev].apply(arguments);
        },
        $addEventListeners: function() {
            var self = this;

            self.$continue.on('click', function() {
                var res = self.result = self.$process();

                if(self.$dataKey !== undefined) {
                    HUD.$store[self.$dataKey] = res;
                }

                self.$step.fadeOut(function() {
                    self.done = true;
                    self.$next.fadeIn(function() {
                        if(self.$next.data('end') === true) {
                            self.emit('finished');
                        }
                    });
                });
            });

            if(self.$processType === 'select') {
                var $selectable = self.$step.find('.js-selectable');
                var alreadySelected = false;
                $selectable.on('click', function() {
                    alreadySelected = $(this).hasClass('selected');
                    $selectable.removeClass('selected');
                    if(alreadySelected) {
                        $(this).removeClass('selected');
                    } else {
                        $(this).addClass('selected');
                    }
                });
            }
        },
        $createProcessor: function() {
            var self = this;

            if(this.$dataKey === undefined) {
                return function() {};
            }

            switch(this.$processType.toLowerCase()) {
                case 'input':
                    return function() {
                        var data = {};
                        var $targets = self.$step.find('.' + self.$input.data('read'));

                        $targets.each(function() {
                            if($(this).val() !== '') {
                                data[$(this).data('index')] = $(this).val();
                            }
                        });

                        return data;
                    };
                case 'select':
                    return function() {
                        var selected = self.$step.find('.js-selectable.selected');
                        var result = this.result = selected.data(self.$useDatakey);

                        return result;
                    };
                default:
                    throw new Error('Undefined process type!');
            }
        }
    };

    HUD.Factory.Stepper = Stepper;
    HUD.Factory.Step = Step;

})(window);
