/* global console */
var _      = require('underscore'),
    colors = require('colors'),
    fs     = require('fs'),
    path   = require('path'),
    errors;

errors = {
    throwError: function (err) {
        if (!err) {
            err = new Error("An error occurred");
        }

        if (_.isString(err)) {
            throw new Error(err);
        }

        throw err;
    },
    
    logInfo: function (info, context, help) {
        if (process.env.NODE_ENV === 'testing') {
            return false;
        }
        
        console.log('Info:'.green, info.green);

        if (context) {
            console.log(context.white);
        }

        if (help) {
            console.log(help.green);
        }
    },

    logWarn: function (warn, context, help) {
        if (process.env.NODE_ENV === 'testing') {
            return false;
        }
        
        console.log('Warning:'.yellow, warn.yellow);

        if (context) {
            console.log(context.white);
        }

        if (help) {
            console.log(help.green);
        }
    },
    
    logError: function (err, context, help) {
        var stack = err ? err.stack : null;
            err   = err.message || err || 'Unknown';
        
        if (process.env.NODE_ENV === 'testing') {
            return false;
        }

        console.error('ERROR:'.red, err.red);

        if (context) {
            console.error(context.white);
        }

        if (help) {
            console.error(help.green);
        }

        if (process.env.DEBUG === 'true' && stack) {
            console.error(stack, '\n');
        }
    },
    
    logErrorAndExit: function (err, context, help) {
        this.logError(err, context, help);
        process.exit(0);
    },

    logAndThrowError: function (err, context, help) {
        this.logError(err, context, help);
        this.throwError(err, context, help);
    }
};

module.exports = errors;