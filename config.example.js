/**
 * Available Sites:
 *   prohardver:
 *     username, password
 *     subsite
 *     mobile
 *     favoriteThreadsOnly
 *
 * Available formats:
 *   list
 *   count
 *   urls
 */

var Configuration = {
    EnabledSites: [
        {
            'name': 'prohardver',
            'username': 'Your Prohardver username',
            'password': 'Your Prohardver password',
            'checkInterval': 10, // In minutes
            'format': 'urls',
            'notifyTo': 'all',
            'subsite': 'prohardver',
            'mobile': false,
            'includeRecent': false
        }
    ],
    PushBulletApiKey: 'Your PushBullet API key'
};

module.exports = Configuration;