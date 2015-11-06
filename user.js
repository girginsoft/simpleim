"use strict"
var db = require("./db");
module.exports = {
    concat_address: function(ip, port) {
        return ip + ":" + port;
    },
    get_user_by_address : function(ip, port, callback) {
        db.get(this.concat_address(ip, port), callback);
    },

    user_exists: function(username, callback) {
        db.get(username, function(data) {
            if (!!data) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    get_address_by_username: function(username, callback) {
        db.get(username, callback);
    },

    add_user: function(ip, port, username) {
        db.set(ip + ":" + port, username);
        db.set(username, ip + ":" + port);
    }, 
    delete_user: function(ip, port) {
        var self = this;
        this.get_user_by_address(ip, port, function(username) {
            db.delete(self.concat_address(ip, port));
            db.delete(username);
        });
    }
}
