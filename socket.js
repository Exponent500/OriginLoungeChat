module.exports = function(app,io){

	var users = [];
	var user = {};

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {

	  socket.room = [];
	  
	  // show that a user connected when a connection event occurs
	  console.log('a user connected', socket.id);

	  // handler for a client socket disconnect
	  socket.on('disconnect', function(){
	    console.log('user disconnected', socket.userid);
	    // grab the index where the specific user's id is located within the global users array
	    var index = users.indexOf(socket.userid);
	    // remove said user id from the global users array
	    if (index > -1) {
	    	users.splice(index,1);
	    }

	    // remove user from all rooms they were in
	    for (var i = 0; i < socket.room.length; i++) {
	    	socket.leave(socket.room[i]);	
	    }
	    
	    // socket.disconnect();
	    console.log(users);

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
	  socket.on('add user', function(msg) {
	
		// assign the userid to the socket object
	  	socket.userid = msg.userid;
	  	// add userid to the list of users
	  	users.push(msg.userid);
	  	
	  	// add the user to a room for each chat he/she is a part of
	  	for (var i = 0; i < msg.chatGroups.length; i++) {
	  		// add each room to the socket object
	  		socket.room[i] = msg.chatGroups[i]._id;
	  		//join each room
	  		socket.join(msg.chatGroups[i]._id);
	  	}

	  	console.log(users);
	  	console.log(socket.userid);
	  	console.log(socket.room);

	  	// send all clients the notification that this client has logged in
	  	io.sockets.emit('logged in', users);
	  	// broadcast to all clients in this room that this specific user has joined
	  	//socket.broadcast.to(msg.chatid).emit('logged in', {username: msg.username, chatgroupId: msg.chatid});

	  });

	});
};