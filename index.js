var Loader      = require('./lib/loader'),
    errors      = require('./lib/errorHandling'),
    PushBullet  = require('./lib/pushbullet');

errors.logInfo('[APP] Loading configuration...');
Loader.loadConfiguration().then(function(config) {
    errors.logInfo('[APP] Setting up PushBullet...');
    PushBullet.connect(config.PushBulletApiKey);
    errors.logInfo('[APP] Starting up...');
    Loader.loadSites();
}).otherwise(function() {
    errors.logInfo('[APP] Quit...');
    process.exit(0);
});