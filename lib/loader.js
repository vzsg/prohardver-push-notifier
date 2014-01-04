var fs                  = require('fs'),
    when                = require('when'),
    path                = require('path'),
    errors              = require('./errorHandling'),
    appRoot             = path.resolve(__dirname, '../'),
    configExamplePath   = path.join(appRoot, "config.example.js"),
    configPath          = path.join(appRoot, "config.js"),
    configuration       = false,
    Sites               = require('../sites');

var writeConfigFile = function() {
    var written = when.defer();

    fs.exists(configExamplePath, function checkTemplate(templateExists) {
        var read,
            write;

        if (!templateExists) {
        return errors.logError(
            new Error('Could not locate a configuration file.'),
            appRoot,
            'Please check your deployment for config.js or config.example.js.'
        );
    }

    read = fs.createReadStream(configExamplePath);
    read.on('error', function (err) {
      /*jslint unparam:true*/
      return errors.logError(new Error('Could not open config.example.js for read.'), appRoot, 'Please check your deployment for config.js or config.example.js.');
    });
    read.on('end', written.resolve);

    write = fs.createWriteStream(configPath);
    write.on('error', function (err) {
      /*jslint unparam:true*/
      return errors.logError(new Error('Could not open config.js for write.'), appRoot, 'Please check your deployment for config.js or config.example.js.');
    });

    read.pipe(write);
  });

  return written.promise;
};

var validateConfiguration = function() {
    var hasPushBulletKey,
        hasAtLeastOneSite,
        config;
    
    if (configuration) {
        return when.resolve(configuration);
    }
    
    try {
        config = require(configPath);
    } catch (ignore) {
    }
    
    if (!config) {
        errors.logError(new Error('Cannot find the configuration file', configPath, 'Ensure your config.js exists.'));
        return when.reject();
    }
    
    hasPushBulletKey  = config.hasOwnProperty('PushBulletApiKey') && (config.PushBulletApiKey.length === 32);
    hasAtLeastOneSite = config.hasOwnProperty('EnabledSites') && (config.EnabledSites.length > 0);
    
    if (!hasPushBulletKey) {
        errors.logError(new Error('Please set your PushBullet API key. You can get it from https://www.pushbullet.com/account'));
        return when.reject();
    }
    
    if (!hasAtLeastOneSite) {
        errors.logError(new Error('Please enable at least one site'));
        return when.reject();
    }
    
    configuration = config;
    
    return when.resolve(configuration);
};

var loadConfiguration = function() {
    var loaded = when.defer(),
        pendingConfig;
    
    fs.exists(configPath, function checkConfig(configExists) {
        if (!configExists) {
            pendingConfig = writeConfigFile();
        }
        when(pendingConfig)
            .then(validateConfiguration)
            .then(loaded.resolve)
            .otherwise(loaded.reject);
    });
    
    return loaded.promise;
};

var loadSites = function() {
    if (!configuration) {
        return loadConfiguration().then(function(config) {
            return Sites(config.EnabledSites);
        }).otherwise(function() {
            return errors.logErrorAndExit(new Error('Configuration error!'));
        });
    }
                                 
    return Sites(configuration.EnabledSites);
};

module.exports.loadConfiguration = loadConfiguration;
module.exports.loadSites = loadSites;