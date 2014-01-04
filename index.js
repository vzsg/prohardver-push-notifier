var Loader      = require('./lib/loader'),
    errors      = require('./lib/errorHandling'),
    PushBullet  = require('./lib/pushbullet');

Loader.loadConfiguration().then(function(config) {
    PushBullet.connect(config.PushBulletApiKey);
    Loader.loadSites();
}).otherwise(function() {
    errors.logInfo('Quit...');
    process.exit(0);
});