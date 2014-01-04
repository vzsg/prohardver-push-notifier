/**
 * Available Sites:
 *   prohardver:
 *     username, password
 *
 * Available formats:
 *   list
 *   count
 */

var Configuration = {
    EnabledSites: [
        {
            'name': 'prohardver',
            'username': 'Your Prohardver username',
            'password': 'Your Prohardver password',
            'checkInterval': 10, // In minutes
            'format': 'list',
            'notifyTo': 'all'  // or iden list (not implemented yet)
        }
    ],
    PushBulletApiKey: 'Your PushBullet API key'
};

module.exports = Configuration;