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
