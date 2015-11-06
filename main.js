"use strict"
var net = require('net');
var events = require('events');
var User = require('./user');
var eventEmitter = new events.EventEmitter();
var server = net.createServer(function(c) { //'connection' listener
  console.log('client connected');
  var sendToUser = '';
  var remoteAddress = c.remoteAddress;
  var remotePort = c.remotePort;
  c.on('end', function() {
    User.delete_user(remoteAddress, remotePort);
    console.log('client disconnected ' + remoteAddress + ":" + remotePort);
  });
  var sendMessage = function (msg, client) {
    msg = msg.replace("\n", "").replace("\r", "");

    User.get_user_by_address(client.remoteAddress, client.remotePort, function(username){
        c.write("\t"+ username + ":" + msg + "\n\r");
    });

  }
  c.on('data', function(data) {
    console.log('Server: ' + data);
    var outData = data.toString('utf8');
    var to = outData.split("to:");
    if (!!to[1]) {
        sendToUser = to[1].trim();
        User.user_exists(sendToUser, function(result) {
            if (!result) {
                c.write('#user not found\r\n');
                sendToUser = null;
            } 
        });
        return;
    }
    var user = outData.split("me:");
    if (!!user[1]) {
        var username =  user[1].trim();
        User.user_exists(username, function(result) {
            if (!result) {
                User.add_user(c.remoteAddress, c.remotePort, user[1].trim());
                c.write('hello ' + username  +'\r\n');
            } else {
                c.write('Username already in use, please change\r\n');
            } 
        });
        return;
    }
    console.log ("Socketmessage: " + outData);
    User.get_address_by_username(sendToUser, function(result) {
        eventEmitter.emit('sendMessage'+result, outData, c);
    });
  });
  eventEmitter.on('sendMessage' + c.remoteAddress + ":" + c.remotePort, sendMessage);
  c.write('Welcome to messaging app\r\n');
});
server.listen(8124, function() { //'listening' listener
  console.log('server bound');
});
