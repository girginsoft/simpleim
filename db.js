"use strict"
var Redis = require('ioredis');
var Config = reqire('./config');
var redis = new Redis(Config.redis_port, Config.redis_host);

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
