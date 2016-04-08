/**
 * /app/provider/fetch.js
 * @author Jan Biasi <jan.biasi@namics.com>
 */
(function(window, undefined) {
    'use strict';

    $(document).ready(function() {
        if($('#js-fetch-scores').length === 0) {
            return false;
        }

        console.log(
            'Refetch interval set to %ds in file /app/provider/settings.js',
            Container.settings.scores.refetch / 1000
        );

        window.setInterval(function() {
            if(Container.settings.debug) {
                console.log(
                    'Refetching scores at %s',
                    new Date().toTimeString().split(' ')[0]
                );
            }

            Util.getScoreTable({ index: true }, function(markup) {
                $('#js-insert').html(markup);
            });
        }, Container.settings.scores.refetch || 5000);
    });

})(window);
