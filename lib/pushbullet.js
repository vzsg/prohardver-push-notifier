var PushBullet = require('../vendors/pushbullet'),
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

    client.devices(function (err, response) {
        if (err) {
            deviceFound.reject();
            return errors.logErrorAndExit(new Error('Failed to get PushBullet device IDs!'), err);
        }
        
        var devices = response.devices.map(function (device) {
            return device.id;
        });
        deviceList = devices;
        return deviceFound.resolve(deviceList);
    });
    
    return deviceFound.promise;
};

var push = function(bullet) {
    var sent = when.defer();
    
    getDevices().then(function(deviceList) {
        if (deviceList.length < 0) {
            return sent.reject();
        }
        
        when.map(deviceList, function(device) {
            var currentBullet = _.clone(bullet);
            currentBullet.device_id = device;
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
    note: function note(title, body) {
        return push({
            type: 'note',
            title: title,
            body: body
        });
    },
    address: function address(name, body) {
        return push({
            type: 'address',
            name: name,
            address: body
        });
    },
    file: function file(filePath) {
        return push({
            type: 'file',
            file: filePath
        });
    },
    list: function list(title, items) {
        if (typeof items === 'string') {
            items = [items];
        }

        return push({
            type: 'list',
            title: title,
            items: items
        });
    },
    link: function link(deviceId, title, url, callback) {
        return push({
            type: 'link',
            title: title,
            url: url
        });
    }
};

module.exports.connect = function(APIKey, notifyDeviceList) {
    client = newClient(APIKey);
};
module.exports.getDevices = getDevices;
module.exports.broadcast  = broadcast;