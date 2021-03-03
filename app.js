const express = require('express');
const app = express()
const server = require('http').Server(app);
const socket = require('socket.io');
const io = socket(server);
const { v4: uuidV4 } = require('uuid');

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('Public'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/new', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('index', {roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connect', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnect', userId)
        })
    })
})

server.listen(port, () => {
    console.log(`Server started on port: ${port}`);
})