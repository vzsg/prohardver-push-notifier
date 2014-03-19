module.exports.name = "Prohardver! fórum";

var subsites = {
    prohardver: {
        name: 'PROHARDVER! fórum',
        desktopPrefix: 'http://prohardver.hu',
        mobilePrefix: 'http://m.prohardver.hu'
    },
    mobilarena: {
        name: 'Mobilarena fórum',
        desktopPrefix: 'http://mobilarena.hu',
        mobilePrefix: 'http://m.mobilarena.hu'
    },
    itcafe: {
        name: 'IT café Fórum',
        desktopPrefix: 'http://itcafe.hu',
        mobilePrefix: 'http://m.itcafe.hu'
    },
    logout: {
        name: 'LOGOUT.hu Fórum',
        desktopPrefix: 'http://logout.hu',
        mobilePrefix: 'http://m.logout.hu'
    },
    gamepod: {
        name: 'GAMEPOD.hu Fórum',
        desktopPrefix: 'http://gamepod.hu',
        mobilePrefix: 'http://m.gamepod.hu'
    },
};

var Config = false,
    Request = require('request'),
    Cheerio = require('cheerio'),
    when = require('when'),
    errorHandling = require('../../lib/errorHandling.js'),
    LRU = require('lru-cache'),

    loginUrl = 'http://mobilarena.hu/muvelet/hozzaferes/belepes.php',
    url = 'http://mobilarena.hu/forum/index.html',
    jar = Request.jar(),
    loginForm,
    prefix,
    threadSelector,
    urlCache = new LRU(100),
    lastPrivMsgCount,
    loginCounter;

var distinctUrl = function(a) {
    return a.reduce(function(p, c) {
        if (!p.some(function(el) { return el.url === c.url; })) {
            p.push(c);
        }
        return p;
    }, []);
};

var filterAlreadyNotified = function (threads, cache) {
    var result = threads.filter(function (thread) {
       return cache.get(thread.url) !== 1; 
    });
                
    result.forEach(function(thread) {
        cache.set(thread.url, 1);            
    });

    return result;    
};

var isLoggedIn = function($body) {
    return $body('.usopts li').length != 3;
}

var login = function() {
    var loggedIn = when.defer();
    
    errorHandling.logInfo('[PH] Logging in...');
    
    Request.post(
        loginUrl,
        {
            form: loginForm,
            jar:  jar
        },
        function(err, resp, body) {
            if (err) {
                loggedIn.reject(err);
            }

            loggedIn.resolve(body);
        }
    );
    
    return loggedIn.promise;
}

module.exports.init = function(config, done) {
    Config = config;

    errorHandling.logInfo(['[PH] Initializing Prohardver! module for user "', config.username, '"'].join(""));
    loginForm = {
        login_email: Config.username,
        login_pass: Config.password,
        stay: '1',
        no_ip_check: '1',
        leave_others: '1'
    };

    if (!!Config.subsite && !subsites[Config.subsite]) {
        errorHandling.logWarn('[PH] subsite "' + Config.subsite + '" not found, defaulting to prohardver');
        Config.subsite = 'prohardver';    
    }

    module.exports.name = subsites[Config.subsite].name;
    prefix = Config.mobile
                ? subsites[Config.subsite].mobilePrefix
                : subsites[Config.subsite].desktopPrefix;

    threadSelector = Config.includeRecent ? 'div.usstuff a.msgs' : 'div.usfavs a.msgs';    
    return done();
};

var fetchMainPage = function() {
    var downloaded = when.defer();

    errorHandling.logInfo('[PH] Fetching forum main page...');
    
    Request(url, {jar: jar}, function (err, resp, body) {
        if (err) {
            downloaded.reject(err);
        }

        downloaded.resolve(body);
    });
    
    return downloaded.promise;
}

var parseBody = function(body) {
    return Cheerio.load(body);
}

var assertLogin = function($body) {
    if (isLoggedIn($body)) {
        errorHandling.logInfo('[PH] Already logged in!');
        return when.resolve($body);
    }

    if (loginCounter >= 3) {
        return when.reject('[PH] Too many login attempts!');
    }

    loginCounter++;
    return login().then(fetchMainPage).then(parseBody).then(assertLogin);
}

function collectNewThreads($) {
    var threads = [], $privMsg;
    
    $(threadSelector).each(function () {
        var $count = $(this);
        threads.push({
            url: (prefix || 'http://prohardver.hu') + $count.attr('href'),
            title: $count.parent().prev().text().trim()
        });
    });

    $privMsg = $('#right .listmenu li.act');
    
    threads = distinctUrl(threads);
    threads = filterAlreadyNotified(threads, urlCache);

    if ($privMsg.length) {
        var count = $privMsg.find('b').text().replace(/[\(\)]/ig, '');
        if (count !== lastPrivMsgCount) {
            threads.push({
                url: (prefix || 'http://prohardver.hu') + $privMsg.find('a').attr('href'),
                title: count + ' privát üzenet!'
            });
            
            lastPrivMsgCount = count;
        }
    } else {
        lastPrivMsgCount = false;
    }
    
    return when.resolve(threads);
}

module.exports.worker = function(done) {
    loginCounter = 0;
    fetchMainPage()
    .then(parseBody)
    .then(assertLogin)
    .then(collectNewThreads)
    .then(function (threads) {
        if (!threads || !threads.length) {
            errorHandling.logInfo('[PH] Nothing to broadcast.');
            done(null, false);
        } else {
            errorHandling.logInfo(['[PH] Found ', threads.length, ' new thread(s)!'].join(""));
            done(null, { list: threads });
        }
    }, function (fail) {
        errorHandling.logError(fail);
        done(null, false);
    });
};