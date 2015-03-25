var Gitter = require('node-gitter');

var args = process.argv.slice(2);
var roomId = args[0];
var keyword = 'calc ';

var token = '53955ade9f01b50e72653d2b7c075360fe38a5cc';
var gitter = new Gitter(token);

if (!roomId) {
  roomId = 'goliney/uwc2015-frontend-q1';
  console.log('No roomId provided, use default: ', roomId)
}

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
                    var expression = clearExpression(message.model.text);
                    var response;
                    if (expression === false) {
                        response = 'Expression might have only digits and special characters: `. * / - + ( )`';
                    } else {
                        try {
                            var answer;
                            answer = eval(expression);
                            response = expression + ' = ' + answer;
                        } catch (error) {
                            response = 'Unable to evaluate an expression';
                        }
                    }
                    room.send(response);
                } else {
                    console.log('... nothing special');
                }
                waitMessage();
            }
        });
    })
    .fail(function(err) {
        console.log('Not possible to join the room: ', err);
    });

//////////

function waitMessage(){
    console.log('Waiting for new messages...');
}

function clearExpression(msg) {
    var dirty = msg.substr(keyword.length);
    var clean = dirty.replace(/[^0-9.\/\*\-\+\(\)\s]/g, "");
    var response = clean === dirty ? clean : false;
    return response;
}