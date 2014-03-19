var PushBullet = require('pushbullet'),
    when = require('when'),
    _ = require('underscore'),
    errors = require('./errorHandling'),
    client = false,
    deviceList = false;

var newClient = function(APIKey) {
    return new PushBullet(APIKey);
};

var getDevices = function(notifyDeviceList) {
    var deviceFound = when.defer();
    if (deviceList && deviceList.length > 0) {
        return deviceFound.resolve(deviceList);
    }

    errors.logInfo('[PB] Getting device list...');
    client.devices(function (err, response) {
        if (err) {
            deviceFound.reject();
            return errors.logErrorAndExit(new Error('Failed to get PushBullet device IDs!'), err);
        }
        
        deviceList = response.devices;
        dumpDeviceList(deviceList);
        return deviceFound.resolve(deviceList);
    });
    
    return deviceFound.promise;
};

var dumpDeviceList = function (deviceList) {
    errors.logInfo("[PB] Available devices:");
    deviceList.forEach(function (device) {
       errors.logInfo(['[PB]  -', device.iden, '(', device.extras.manufacturer, device.extras.model, ')'].join(' ')); 
    });
};

var push = function(bullet) {
    var sent = when.defer();
    
    getDevices().then(function(deviceList) {
        if (bullet.target && bullet.target !== 'all') {
            var targets = typeof bullet.target === 'string'
                    ? [bullet.target]
                    : bullet.target;
            
            deviceList = deviceList.filter(function (device) {
               return _.contains(targets, device.iden); 
            });
        }

        if (deviceList.length < 0) {
            errors.logWarn('[PB] No valid device identifier found!');
            return sent.reject();
        }
        
        when.map(deviceList, function(device) {
            var currentBullet = _.clone(bullet);
            currentBullet.device_id = device.id;
            return when.promise(function(resolve, reject) {
                return client.push(
                    currentBullet,
                    function(err, result) {
                        //console.log(err, result);
                        return resolve(result);
                    }
                );
            });
        }).then(sent.resolve).otherwise(sent.reject);
    }).otherwise(sent.reject);
    
    return sent.promise;
};

var broadcast = {
    note: function note(title, body, target) {
        return push({
            type: 'note',
            title: title,
            body: body,
            target: target
        });
    },
    address: function address(name, body, target) {
        return push({
            type: 'address',
            name: name,
            address: body,
            target: target
        });
    },
    file: function file(filePath, target) {
        return push({
            type: 'file',
            file: filePath,
            target: target
        });
    },
    list: function list(title, items, target) {
        if (typeof items === 'string') {
            items = [items];
        }

        return push({
            type: 'list',
            title: title,
            items: items,
            target: target
        });
    },
    link: function link(deviceId, title, url, target) {
        return push({
            type: 'link',
            title: title,
            url: url,
            target: target
        });
    }
};

module.exports.connect = function(APIKey, notifyDeviceList) {
    client = newClient(APIKey);
};
module.exports.getDevices = getDevices;
module.exports.broadcast  = broadcast;