module.exports = function(app,io){

	// Initialize a new socket.io application, named 'chat'
	var chat = io.on('connection', function (socket) {

  
	  // show that a user connected when a connection event occurs
	  console.log('a user connected', socket.id);

	  // send a message to everyone (but the person who connected) when someone connects
	  // socket.broadcast.emit('user connected', 'someone joined');

	  // handler for a socket disconnect (why does this go within io.on? shouldn't it go in it's own separate function??)
	  socket.on('disconnect', function(){
	    console.log('user disconnected', socket.id);
	    // send a message to everyone (but the person who disconnected) when someone disconnected
	    // socket.broadcast.emit('user disconnected', "someone left");
	  });

	  // handler for when a chat message comes in from the app
	  socket.on('chat message', function(msg){
	  	// send chat message to everyone except for who sent it
	  	socket.broadcast.to(msg.messagerecipient_id).emit('chat message', msg);
		// send chat message to everyone, including who sent it
	  	//io.sockets.in(msg.messagerecipient_id).emit('chat message', msg);
	    console.log(msg.messagerecipient_id);
	  });

	  // socket.io listener for client subscribe event, which is when a client asks to join a room
	  socket.on('subscribe', function(msg) {

	  	console.log(msg.username + 'has joined room ' + msg.chatgroupId);
	  	// broadcast to all clients in this room that this specific user has joined
	  	socket.broadcast.to(msg.chatgroupId).emit('logged in', {username: msg.username, chatgroupId: msg.chatgroupId});
	  	// join the room
	  	socket.join(msg.chatgroupId);

	  });

		// When the client emits the 'load' event, reply with the 
		// number of people in this chat room

		// socket.on('load',function(data){

		// 	var room = findClientsSocket(io,data);
		// 	if(room.length === 0 ) {

		// 		socket.emit('peopleinchat', {number: 0});
		// 	}
		// 	else if(room.length === 1) {

		// 		socket.emit('peopleinchat', {
		// 			number: 1,
		// 			user: room[0].username,
		// 			avatar: room[0].avatar,
		// 			id: data
		// 		});
		// 	}
		// 	else if(room.length >= 2) {

		// 		chat.emit('tooMany', {boolean: true});
		// 	}
		// });

		// // When the client emits 'login', save his name and avatar,
		// // and add them to the room
		// socket.on('login', function(data) {

		// 	var room = findClientsSocket(io, data.id);
		// 	// Only two people per room are allowed
		// 	if (room.length < 2) {

		// 		// Use the socket object to store data. Each client gets
		// 		// their own unique socket object

		// 		socket.username = data.user;
		// 		socket.room = data.id;
		// 		socket.avatar = gravatar.url(data.avatar, {s: '140', r: 'x', d: 'mm'});

		// 		// Tell the person what he should use for an avatar
		// 		socket.emit('img', socket.avatar);


		// 		// Add the client to the room
		// 		socket.join(data.id);

		// 		if (room.length == 1) {

		// 			var usernames = [],
		// 				avatars = [];

		// 			usernames.push(room[0].username);
		// 			usernames.push(socket.username);

		// 			avatars.push(room[0].avatar);
		// 			avatars.push(socket.avatar);

		// 			// Send the startChat event to all the people in the
		// 			// room, along with a list of people that are in it.

		// 			chat.in(data.id).emit('startChat', {
		// 				boolean: true,
		// 				id: data.id,
		// 				users: usernames,
		// 				avatars: avatars
		// 			});
		// 		}
		// 	}
		// 	else {
		// 		socket.emit('tooMany', {boolean: true});
		// 	}
		// });

		// // Somebody left the chat
		// socket.on('disconnect', function() {

		// 	// Notify the other person in the chat room
		// 	// that his partner has left

		// 	socket.broadcast.to(this.room).emit('leave', {
		// 		boolean: true,
		// 		room: this.room,
		// 		user: this.username,
		// 		avatar: this.avatar
		// 	});

		// 	// leave the room
		// 	socket.leave(socket.room);
		// });


		// // Handle the sending of messages
		// socket.on('msg', function(data){

		// 	// When the server receives a message, it sends it to the other person in the room.
		// 	socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user, img: data.img});
		// });
	});

	// function findClientsSocket(io,roomId, namespace) {
	// 	var res = [],
	// 		ns = io.of(namespace ||"/");    // the default namespace is "/"

	// 	if (ns) {
	// 		for (var id in ns.connected) {
	// 			if(roomId) {
	// 				var index = ns.connected[id].rooms.indexOf(roomId) ;
	// 				if(index !== -1) {
	// 					res.push(ns.connected[id]);
	// 				}
	// 			}
	// 			else {
	// 				res.push(ns.connected[id]);
	// 			}
	// 		}
	// 	}
	// 	return res;
	// }

};