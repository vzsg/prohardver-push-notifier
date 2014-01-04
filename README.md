prohardver-push-notifier (PH!usher)
===================================

Minimal web scraper and push notifier for new messages on the Prohardver! forums (www.prohardver.hu).

How to use:
-----------

1. Clone this repository to your target system.
2. Run 'npm install' to install dependencies.
3. Cony `config.example.js` to `config.js` _(or try to run the application)_
3. Set your Prohardver! and PushBullet credentials in `config.js`.
4. _(Optional)_ Set message format and polling interval.
5. Run with `node index.js`.

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
            'format': 'list',                         // count or list
            'notifyTo': 'all'                         // not implementes yet
        }
    ],
    PushBulletApiKey: 'Your PushBullet API key'       // !!! Fill it
};
```

Example:
--------

```
> git clone https://github.com/Yitsushi/prohardver-push-notifier.git
> npm install
> cp config.example.js config.js

Edit `config.js`.

> node index.js
```
