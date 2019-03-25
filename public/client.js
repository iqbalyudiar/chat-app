$(function(){
    // make connection
    var socket = io.connect('http://localhost:3000')

    //input
    var message = $("#message")
    var username = $("#username")
    var send_message = $("#send_message")
    var send_username = $("#send_username")
    var chatroom = $("#chatroom")
    var feedback = $("#feedback")


    //Emit message
	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
    })

    // Validate empty message
    message.keypress(function(){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == 13){
            if(message.val() == ''){
                alert('Message cannot be empty')
            } else {
                socket.emit('new_message', {message : message.val()})
                console.log(message.val());
            }
            
        }
		
	})      
    
    //Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
	})
    

    // Emit a username
    send_username.click(function(){
        console.log(username.val())
        socket.emit('change_username', {username : username.val()})
        username.val('')
        
    })
    // username.keypress(function(event){
    //     var keycode = (event.keyCode ? event.keyCode : event.which);
    //     if(keycode == 13){
    //         socket.emit('change_username', {username : username.val()})
    //         console.log(username.val());
    //         username.val('')
    //     }
    // })
    
    // Validate a username
    username.keypress(function(){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        var x = true;
        if(keycode == 13){
            if(username.val() == ''){
                alert('Please enter your username')
            } else if(username.val() != ''){
                socket.emit('change_username', {username : username.val()});
                socket.on("change_username", (data) => {
                    feedback.html('');
                    username.val('');
                    chatroom.append("<p class='name'>"+ 'username has changed to ' + data.username  +"</p>")
                    setTimeout(() => $('.name').remove(), 500)
                })
            }
            
        }
		
	})
    
    // Listen on username
    

    // Emit typing
    message.bind("keypress", () => {
        socket.emit('typing')
    })

    // Listen on typing
    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>");
        setTimeout(() => feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>").remove(), 3000);
    })

    
        

});


