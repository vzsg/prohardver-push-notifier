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

    loginUrl = 'http://mobilarena.hu/muvelet/hozzaferes/belepes.php',
    url = 'http://mobilarena.hu/forum/index.html',
    jar = Request.jar(),
    loginForm,
    prefix;

var distinctUrl = function(a) {
    return a.reduce(function(p, c) {
        if (!p.some(function(el) { return el.url === c.url; })) {
            p.push(c);
        }
        return p;
    }, []);
};

module.exports.init = function(config, done) {
    Config = config;

    loginForm = {
        login_email: Config.username,
        login_pass: Config.password,
        stay: '1',
        no_ip_check: '1',
        leave_others: '1'
    };

    if (!!Config.subsite && !subsites[Config.subsite]) {
        console.log('WARN: subsite "' + Config.subsite + '" not found, defaulting to prohardver');
        Config.subsite = 'prohardver';    
    }

    module.exports.name = subsites[Config.subsite].name;
    prefix = Config.mobile
                ? subsites[Config.subsite].mobilePrefix
                : subsites[Config.subsite].desktopPrefix;

    return Request.post(
        loginUrl,
        {
            form: loginForm,
            jar:  jar
        },
        function(err, resp, body) {
            if (err) {
                return done(null, false);
            }

            return done();
        }
    );
};

module.exports.worker = function(done) {
    return Request(
        url,
        { jar:  jar },
        function(err, resp, body) {
            if (err) {
                return done(null, false);
            }

            var $ = Cheerio.load(body),
                threads = [];

            $('div.usstuff a.msgs').each(function () {
                var $count = $(this);
                threads.push({
                    count: Number($count.text().trim()),
                    url: (prefix || 'http://prohardver.hu')  + $count.attr('href'),
                    title: $count.parent().prev().text().trim(),
                    message: $count.attr('title')
                });
            });

            threads = distinctUrl(threads);

            if (!threads || !threads.length) {
                return done(null, false);
            }

            done(
                null,
                {
                    template: "%d új hozzászólás érkezett",
                    list: threads
                }
            );
        }
    );
};