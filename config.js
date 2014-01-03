(function(exports) {
    var config = {
        prohardver: {
            username: process.env.PROHARDVER_USER,
            password: process.env.PROHARDVER_PASSWORD
        },
        pushbullet: {
            apikey: process.env.PUSHBULLET_APIKEY
        },
        format: process.env.PROHARDVER_MESSAGE_FORMAT || 'list',
        interval: process.env.PROHARDVER_CHECK_INTERVAL || 10,
    };
    
    if (!config.prohardver.username) throw 'PROHARDVER_USER environment variable is not set! Set it to your PH! email address!';
    if (!config.prohardver.password) throw 'PROHARDVER_PASSWORD environment variable is not set! Set it to your PH! password!';
    if (!config.pushbullet.apikey) throw 'PUSHBULLET_APIKEY environment variable is not set! Copy yours from https://www.pushbullet.com/account';
    
    exports.config = config;
})(exports);