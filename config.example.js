/**
 * Available Sites:
 *   prohardver:
 *     username, password - credentials for the PH! sites
 *     subsite - PH! flavor in the links: prohardver, mobilarena, itcafe, logout or gamepod
 *     mobile - set to true if you want mobile-friendly links
 *     includeRecent - set to true if you want notifications for your recent threads too, not just favorites
 *
 * Common settings:
 *   checkInterval - number of minutes to wait between polling the forum
 *   notifyTo - a single or a list of device identifiers to send pushes to; 'all' and true (boolean) are jokers
 * 
 * Be sure to copy your PushBullet API key from https://pushbullet.com/account!
 */

var Configuration = {
    EnabledSites: [
        {
            'name': 'prohardver',
            'username': 'Your Prohardver username',
            'password': 'Your Prohardver password',
            'checkInterval': 10, // In minutes
            'notifyTo': 'all',
            'subsite': 'prohardver',
            'mobile': false,
            'includeRecent': false
        }
    ],
    PushBulletApiKey: 'Your PushBullet API key'
};

module.exports = Configuration;