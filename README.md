# simpleim
Simple Instant Messanger over TCP with nodejs
#Requirements
 - nodejs
 - redis-server

#Installation
  - copy config.js.example as config.js
  - change parameters in config file
#Run server
$node main.js

#Connect to client
$nc|netcat ip port

#Usage:
Login with username
me:{yourusername}

To send message to user, write this command
to:{nameofuser}

Then write your message. 
If you want to switch user, you have to write to:{nameofuser} again

