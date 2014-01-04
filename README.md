prohardver-push-notifier (PH!usher)
===================================

Minimal web scraper and push notifier for new messages on the Prohardver! forums (www.prohardver.hu).

How to use:
-----------

0. Install git and Node.js on your target system.
1. Clone this repository.
2. Run 'npm install' to install dependencies.
3. Copy `config.example.js` to `config.js` _(or try to run the application)_
3. Set your Prohardver! and PushBullet credentials in `config.js`.
4. _(Optional)_ Set message format and polling interval.
5. Run with `node index.js` or forever.

Configuration File:
-------------------

```
var Configuration = {
    EnabledSites: [
        {
            'name': 'prohardver',
            'username': 'Your Prohardver username',   // !!! Fill it
            'password': 'Your Prohardver password',   // !!! Fill it
            'checkInterval': 10,                      // in minutes
            'format': 'list',                         // count, list or urls
            'notifyTo': 'all'                         // not implemented yet
        }
    ],
    PushBulletApiKey: 'Your PushBullet API key'       // !!! Fill it
};
```

Example:
--------

```
> git clone https://github.com/vzsg/prohardver-push-notifier.git
> cd prohardver-push-notifier
> npm install
> cp config.example.js config.js

Edit `config.js`.

> node index.js
```
