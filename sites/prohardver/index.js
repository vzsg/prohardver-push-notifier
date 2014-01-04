module.exports.name = "Prohardver! fórum";

var Config = false,
    Request = require('request'),
    Cheerio = require('cheerio'),

    loginUrl = 'http://mobilarena.hu/muvelet/hozzaferes/belepes.php',
    url = 'http://mobilarena.hu/forum/index.html',
    jar = Request.jar(),
    loginForm;

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
                threads = [],
                totalMessages,
                messagesPerThread;

            $('div.usstuff a.msgs').each(function () {
                var $count = $(this);
                threads.push({
                    count: Number($count.text().trim()),
                    url: 'http://prohardver.hu' + $count.attr('href'),
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