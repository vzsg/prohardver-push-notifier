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
4. _(Optional)_ Configure optional parameters, like polling interval, PH! flavor (subsite), mobile-friendly links.
5. Run with `node index.js` or forever.

If you set the polling interval to 0, false or other "false" value, the program will stop after a single check.

Configuration File:
-------------------

```
var Configuration = {
    EnabledSites: [
        {
            'name': 'prohardver',
            'username': 'Your Prohardver username',   // important!
            'password': 'Your Prohardver password',   // important!
            'checkInterval': 10,                      // in minutes, set to 0 or false to disable periodic checks
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

Magyar gyorstalpaló:
--------------------

0. Telepítsd fel a`git`et és a Node.js-t a gépedre.
1. Töltsd le a projekt forrását oda, ahonnan futtatni akarod. A klónozást lásd jobb oldalon.
2. Menj ebbe a mappába, majd futtasd az `npm install` parancsot a szükséges csomagok letöltéséhez.
3. Készítsz másolatot a `config.example.js`-ről `config.js` néven _(ezt az alkalmazás is megteszi első indításkor)_
3. Állítsd be a Prohardver! felhasználóneved és jelszavad, valamint a PushBullet API kulcsodat a `config.js`-ben.
4. _(Nem kötelező)_ Finomhangold a beállításokat: a pushokban leküldött PH! aloldalt; mobil- vagy normál fórumot; lekérdezések közötti időt; "Itt szóltam hozzá" topikok figyelését; vagy azt az eszközazonosítót*, amire a pushok mennek.
5. Futtasd az alkalmazást a `node index.js` paranccsal, vagy a `forever` segítségével (lásd Sancho leírását alább).

*: A lehetséges célpontokat indítás után kilistázza az alkalmazás.

Ha a lekérdezési intervallum 0 vagy egyéb hamis érték, a program a lekérdezés után leáll.

Csendes indítás Node.js forever segítségével (@sanchomuzax):
------------------------------------------------------------

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
