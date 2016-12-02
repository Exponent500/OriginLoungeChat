module.exports = function(app,io){

	var users = [];
	var user = {};

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {

	  socket.room = [];
	  
	  console.log('a user connected', socket.id);

	  // socket.io listener for when a client disconnects
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
	    
	    console.log(users);

	  });

	  // socket.io listener for when a chat message comes in from a client
	  socket.on('chat message', function(msg){
	  	// send chat message to all clients except the client that sent the message
	  	socket.broadcast.to(msg.chatid).emit('chat message', msg);
	    console.log(msg.chatid);
	  });

	  // socket.io listener that adds client to local users list and all rooms the client is 
	  // subscribed to. It also lets all other clients know that it has logged in.
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

	  	// send all clients the notification that this client has logged in and pass along the local
	  	// list of users
	  	io.sockets.emit('logged in', {users:users, userLoggedIn: msg.userid});

	  });

	});
};