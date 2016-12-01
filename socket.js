module.exports = function(app,io){

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {

	  // show that a user connected when a connection event occurs
	  console.log('a user connected', socket.id);

	  // handler for a socket disconnect (why does this go within io.on? shouldn't it go in it's own separate function??)
	  socket.on('disconnect', function(){
	    console.log('user disconnected', socket.id);
	    // send a message to everyone (but the person who disconnected) when someone disconnected
	    // socket.broadcast.emit('user disconnected', "someone left");
	  });

	  // handler for when a chat message comes in from the app
	  socket.on('chat message', function(msg){
	  	// send chat message to everyone except for who sent it
	  	socket.broadcast.to(msg.chatid).emit('chat message', msg);
		// send chat message to everyone, including who sent it
	  	//io.sockets.in(msg.messagerecipient_id).emit('chat message', msg);
	    console.log(msg.chatid);
	  });

	  // socket.io listener for client subscribe event, which is when a client asks to join a room
	  socket.on('subscribe', function(msg) {

	  	console.log(msg.username + 'has joined room ' + msg.chatid);
	  	// broadcast to all clients in this room that this specific user has joined
	  	socket.broadcast.to(msg.chatid).emit('logged in', {username: msg.username, chatgroupId: msg.chatid});
	  	// join the room
	  	socket.join(msg.chatid);

	  });

	});
};