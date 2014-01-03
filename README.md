prohardver-push-notifier (PH!usher)
===================================

Minimal web scraper and push notifier for new messages on the Prohardver! forums (www.prohardver.hu).

How to use:
-----------

1. Clone this repository to your target system.
2. Run 'npm install' to install dependencies.
3. Set your Prohardver! and PushBullet credentials in environment variables.
4. (Optional) set message format and polling interval.
5. Run with 'node phusher.js'.

Example:
--------

```
> git clone https://github.com/vzsg/prohardver-push-notifier.git
> npm install
> export PROHARDVER_USER=thisisjustin@example.com
> export PROHARDVER_PASSWORD=thisismypassword
> export PUSHBULLET_APIKEY=v10KA...
> export PROHARDVER_MESSAGE_FORMAT=note  # the default is "list"
> export PROHARDVER_CHECK_INTERVAL=20  # minutes, the default is 10
> node phusher.js
```
