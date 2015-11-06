"use strict"
var Redis = require('ioredis');
var redis = new Redis(6379, '10.10.10.72');

module.exports = {
    set: function (key, value) {
        redis.set(key, value);
    },
    get: function(key, callback) {
        redis.get(key, function(err, result) {
            if (!!err) {
                console.error(err);
                callback(null);
                return;
            }
            callback(result);
        });
    }, 
    delete: function(key) {
        redis.del(key);
    }
}
