/* global setTimeout */
var Async = require('async'),
    when = require('when'),
    PushBullet = require('../lib/pushbullet'),
    errors = require('../lib/errorHandling'),
    workers = {};

var sendNotification = function(results, options) {
    return when.all(results.list.map(function (item) {
        return PushBullet.broadcast.link(
            options.name,
            item.title,
            item.url,
            options.target
        );
    }));
};

var Iterate = function(action, options, id) {
    var method = function(done) {
        // console.log([ id, " has a new iteration." ].join());
        action(function(err, results) {
            if(err) {
                return done(err);
            }
            
            if (results !== false) {
                sendNotification(results, options);
            }

            var wait = options.interval;

            if (!wait) {
                errors.logInfo(['[SCH] Periodic checks disabled for ', id, ', stopping worker.'].join(''));
                return false;
            }
            
            errors.logInfo(['[SCH] Site ', id, ' is sleeping for ', wait/60000, ' minutes...'].join(''));
            return setTimeout(function() {
                return method(done);
            }, wait);
        });
    };
    return method;
};

module.exports = function(enabledSites) {
    Async.mapLimit(
        enabledSites,
        3,
        function(enabled, done) {
            var site = null;
            try {
                site = require("./" + enabled.name);
            } catch (ignore) {
                errors.logWarn("[SCH] Site not found: " + enabled.name);
            }
            if (site) {
                if (!site.hasOwnProperty('init') || !site.hasOwnProperty('name') || !site.hasOwnProperty('worker')) {
                    errors.logWarn("[SCH] Invalid site: " + enabled.name);
                    site = false;
                }
            }
            return site.init(enabled, function() {
                return done(
                    null,
                    {
                        id: enabled.name,
                        options: {
                            interval: enabled.checkInterval * 1000 * 60,
                            name: site.name,
                            target: enabled.notifyTo
                        },
                        worker: site.worker
                    }
                );
            });
        },
        function(err, availableSites) {
            availableSites.forEach(function(site) {
                workers[site.id] = Iterate(
                    site.worker,
                    site.options,
                    site.id
                );
            });
            
            return Async.parallel(workers);
        }
    );
};