prohardver-push-notifier (PH!usher)
===================================

Minimal web scraper and push notifier for new messages on the Prohardver! forums (www.prohardver.hu).

How to use:
-----------

0. Install git and Node.js on your target system.
1. Clone this repository.
2. Run 'npm install' to install dependencies.
3. Set your Prohardver! and PushBullet credentials in environment variables.
4. (Optional) set message format and polling interval.
5. Run with 'node phusher.js'.

Example:
--------

```
> git clone https://github.com/vzsg/prohardver-push-notifier.git
> cd prohardver-push-notifier
> npm install
> export PROHARDVER_USER=thisisjustin@example.com
> export PROHARDVER_PASSWORD=thisismypassword
> export PUSHBULLET_APIKEY=v10KA...
> export PROHARDVER_MESSAGE_FORMAT=note  # optional; defaults to "list"
> export PROHARDVER_CHECK_INTERVAL=20  # optional, the unit is minutes; defaults to 10
> node phusher.js
```
