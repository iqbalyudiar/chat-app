const express = require('express')
const app = express()

// set template engine ejs
app.set('view engine', 'ejs')

//middlewares
app.use(express.static('public'))

//routes
app.get('/', (req, res) => {
    res.render('index')
})

// Listen on port 3000
server = app.listen(3000)

//configure the socket.io
const io = require("socket.io")(server)

//listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected')

    //default username
    socket.username = "Anonymous"

    //listen on change username
    socket.on('change_username', (data)=> {
        socket.username = data.username;
        io.sockets.emit('change_username', {username : data.username})
    })

    //listen on new message
    socket.on('new_message', (data) => {
        // broadcast new message
        io.sockets.emit('new_message', {message : data.message, username: socket.username});
    })

    // listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', {username : socket.username})
    })
})