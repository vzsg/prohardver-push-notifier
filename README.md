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
4. _(Optional)_ Configute optional parameters, like polling interval, PH! flavor (subsite), mobile-friendly links.
5. Run with `node index.js` or forever.

Configuration File:
-------------------

```
var Configuration = {
    EnabledSites: [
        {
            'name': 'prohardver',
            'username': 'Your Prohardver username',   // important!
            'password': 'Your Prohardver password',   // important!
            'checkInterval': 10,                      // in minutes
            'subsite': 'prohardver',                  // PH subsite to use in URLs
            'mobile': false,                          // true if you want mobile-friendly URLs
            'notifyTo': 'all'                         // replace with a single or an array of device idens for selective sending
        }
    ],
    PushBulletApiKey: 'Your PushBullet API key'       // important! get yours from https://pushbullet.com/account
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

Hungarian FAQ for beginners (GYIK):
-----------------------------------

Csendes indítás Node.js forever:

Telepíteni kell a forever csomagot:
```
> $ npm install forever
```
Indítsd el:
```
> $ forever start index.js
```

Csendes indítás init.d script segítségével:

Írd át ezt a scriptet: http://goo.gl/Eg7Ebc így:
```
NODE_EXEC= /opt/node/bin/node  // node bináris útvonala, "which node" megmondja hol van
NODE_ENV= "production"          // kihagyható
NODE_APP='index.js'
PID_FILE=$APP_DIR/pid/app.pid
LOG_FILE=$APP_DIR/log/app.log
APP_DIR='<phusher_könyvtárához_teljes_útvonal>'
CONFIG_DIR=$APP_DIR
```

Mentsd el az /etc/init.d/<script_neve> helyre root joggal, majd:
```
> $ sudo update-rc.d <script_neve> defaults
```

Lépj be az index.js könyvtárába, és hozd létre a szükséges log fájlokat:
```
$ mkdir /pid
$ mkdir /log
$ nano /pid/app.pid
$ nano /log/app.log
```

Ezután indíthatod:
```
$ sudo /etc/init.d/<script_neve> <stop|start|restart|status>
```

Ha nem akarod, hogy reboot után a géppel induljon, akkor:
```
$ sudo update-rc.d -f <script_neve> remove
```
