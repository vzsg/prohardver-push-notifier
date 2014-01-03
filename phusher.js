var config = require('./config').config,
    req = require('request'),
    cheerio = require('cheerio'),
    PushBullet = require('./pushbullet'),
    pusher = new PushBullet(config.pushbullet.apikey),
    loginUrl = 'http://mobilarena.hu/muvelet/hozzaferes/belepes.php',
    url = 'http://mobilarena.hu/forum/index.html';
    jar = req.jar(),
    loginForm = {
        login_email: config.prohardver.username,
        login_pass: config.prohardver.password,
        stay: '1',
        no_ip_check: '1',
        leave_others: '1'
    };

function distinctUrl(a) {
    return a.reduce(function(p, c) {
        if (!p.some(function(el) { return el.url === c.url })) p.push(c);
        return p;
    }, []);
};

function checkNewMessages() {
    console.log('Logging in as ' + config.prohardver.user + '...');
    req.post(loginUrl, { form: loginForm,  jar: jar }, handleLoginResponse);
}

function handleLoginResponse(err, resp, body) {
    if (err) {
        console.log('Login failed!', err);
        return;
    }

    console.log('Fetching forum main page...');
    req(url, { jar: jar }, handleForumResponse);
}

function broadcastThreadList(list) {
    console.log('Getting PushBullet device list...');
    
    pusher.devices(function (err, response) {
        if (err) {
            console.log('Failed to get PushBullet device IDs!', err);
            return;
        }
        
        var devices = response.devices.map(function (el) { return el.id; });
        console.log('Found ' + devices.length + " device(s).", devices);
        console.log('Pushing messages...');
        devices.forEach(function(el) {
            pusher.list(el, 'Prohardver! fórum', list);
        });
    });    
}

function broadcastMessageCount(count) {
    console.log('Getting PushBullet device list...');
    
    pusher.devices(function (err, response) {
        if (err) {
            console.log('Failed to get PushBullet device IDs!', err);
            return;
        }
        
        var devices = response.devices.map(function (el) { return el.id; });
        console.log('Found ' + devices.length + " device(s).", devices);
        console.log('Pushing messages...');
        devices.forEach(function(el) {
            pusher.note(el, 'Prohardver! fórum', count + ' új hozzászólás érkezett!');
        });
    });
}

function handleForumResponse(err, resp, body) {
    if (err) {
        console.log('Failed to load forum main page!', err);
        return;
    }

    var $ = cheerio.load(body),
        threads = [],
        totalMessages,
        messagesPerThread;
        
    $('div.usstuff a.msgs').each(function () {
        var $count = $(this);
        threads.push({
            count: Number($count.text().trim()),
            url: $count.attr('href'),
            title: $count.parent().prev().text().trim(),
            message: $count.attr('title') });
    });

    threads = distinctUrl(threads);
    totalMessages = threads.reduce(function (prev, item) {
        return prev + item.count;
    }, 0);
    
    messagesPerThread = threads.map(function (th) {
        return th.title + ' - ' + th.message;
    });
    
    console.log('Total messages:', totalMessages);
    
    if (totalMessages === 0) {
        console.log('Nothing to do...');
        return;
    }

    if (config.format === 'list') {
        broadcastThreadList(messagesPerThread);
    } else {
        broadcastMessageCount(totalMessages);
    }
}

setInterval(checkNewMessages, config.interval * 60 * 1000);
checkNewMessages();