/**
 * /app/provider/steps.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    function Stepper(container) {
        this.$parent = container;
        this.$steps = container.find('> .step');
        this.$instance = [];
    }

    Stepper.prototype = {
        start: function(handler) {
            var self = this;
            self.$callback = handler;

            self.$steps.each(function() {
                var step = new HUD.Factory.Step($(this));

                step.on('finished', function() {
                    (self.$callback || Util.noop)($(self.$steps[self.$steps.length - 1]));
                });

                self.$instance.push(step);
            });
        }
    };

    function Step(node) {
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
            var self = this;
            for(var handler in this.$handlers) {
                self.$handlers[handler].apply(arguments);
            }
        },
        $addEventListeners: function() {
            var self = this;

            self.$continue.on('click', function() {
                var res = self.result = self.$process();

                if(self.$dataKey !== undefined) {
                    HUD.$store[self.$dataKey] = res;
                }

                self.$step.fadeOut(function() {
                    self.$next.fadeIn(function() {
                        if(self.$next.data('end') === true) {
                            self.emit('finished');
                        }
                    });
                });
            });

            if(self.$processType === 'select') {
                self.$step.find('.js-selectable').on('click', function(ev) {
                    $(this).toggleClass('selected');
                });
            }
        },
        $createProcessor: function() {
            if(this.$dataKey === undefined) {
                return function() {};
            }

            switch(this.$processType.toLowerCase()) {
                case 'input':
                    var self = this;

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

                    break;
                case 'select':
                    var self = this;

                    return function() {
                        var selected = self.$step.find('.js-selectable.selected');
                        var result = this.result = selected.data(self.$useDatakey);

                        return result;
                    };

                    break;
                default:
                    throw new Error('Undefined process type!');
                    break;
            }
        }
    };

    HUD.Factory.Stepper = Stepper;
    HUD.Factory.Step = Step;

})(window);
