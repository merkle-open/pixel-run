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
