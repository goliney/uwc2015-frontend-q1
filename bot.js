var Gitter = require('node-gitter');


var args = process.argv.slice(2);
var roomId = args[0];
var keyword = 'calc ';


var token = '8b9d08fac04bf05b9e0a41106800ad159af192b8';
var gitter = new Gitter(token);

gitter.currentUser()
    .then(function(user) {
        console.log('You are logged in as:', user.username);
    });

gitter.rooms.join(roomId)
    .then(function(room) {
        console.log('Joined room: ', room.name);
        waitMessage();

        var events = room.streaming().chatMessages();

        // The 'chatMessages' event is emitted on each new message
        events.on('chatMessages', function(message) {
            if (message.operation == 'create') {
                console.log('Got a message...');
                if (message.model.text.indexOf(keyword) === 0) {
                    console.log('CAAALC!!!!', message.model.text);
                    room.send('I promise I will calc it... but later');
                } else {
                    console.log('... nothing special');
                }
            }
            waitMessage();
        });
    })
    .fail(function(err) {
        console.log('Not possible to join the room: ', err);
    });

//////////

function waitMessage(){
    console.log('Waiting for new messages...');
}