var net = require('net');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var mappings = {};
var server = net.createServer(function(c) { //'connection' listener
  console.log('client connected');
  console.log(c.remoteAddress);
  console.log(c.remotePort);
  var sendToUser = '';
  c.on('end', function() {
    console.log('client disconnected');
  });
  var sendMessage = function (msg, client) {
    msg = msg.replace("\n", "").replace("\r", "");
    c.write("==== "+mappings[client.remoteAddress + ":" + client.remotePort] + ":" + msg + "\n\r");
  }
  c.on('data', function(data) {
    console.log('Server: ' + data);
    outData = data.toString('utf8');
    var to = outData.split("to:");
    if (!!to[1]) {
        sendToUser = to[1].trim();
        return;
    }
    var user = outData.split("me:");
    if (!!user[1]) {
        mappings[c.remoteAddress + ":" + c.remotePort] = user[1].trim();
        c.write('hello ' + mappings[c.remoteAddress + ":" + c.remotePort]  +'\r\n');
        return;
    }
    console.log ("Socketmessage: " + outData);
    for (key in mappings) {
        if (mappings[key] == sendToUser) {
            eventEmitter.emit('sendMessage'+key, outData, c);
            break;
        }
    }
  });
  eventEmitter.on('sendMessage' + c.remoteAddress + ":" + c.remotePort, sendMessage);
  c.write('Welcome to messaging app\r\n');
  console.log(mappings);
});
server.listen(8124, function() { //'listening' listener
  console.log('server bound');
});
