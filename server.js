const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost:27017/chatapp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
});

const db = mongoose.connection;

const userSchema = new mongoose.Schema({
    username: String, 
    password: String,
});

const messageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    text: String,
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

const verifyToken = (token) => {
    return jwt.verify(token, 'your_secret_key');
};

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.json());

app.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      if(!username || !password){
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error registering user' });
    }
});

app.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ user: { username } }, 'your_secret_key', { expiresIn: '1h' });

      res.json({ token, redirect: '/chat', message: 'Login successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error logging in' });
    }
  });

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', () => {
    console.log('Connected to the database');
});

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));


app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


io.use(async (socket, next) => {
    try{
        const token = socket.handshake.auth.token;
        if(token) {
            const decoded = verifyToken(token);
            socket.user = decoded.user;
        }
        next();
    } catch (error){
        console.error(error);
        next(new Error('Authentication failed'));
    }
});

io.on('connection', async function(socket){
    const connectedUsername = socket.user && socket.user.username;

    socket.on('newuser', function(newUsername){
        socket.broadcast.emit("update", newUsername + " joined the conversation");
    });
    socket.on("exituser", function(exitUsername){
        socket.broadcast.emit('update', exitUsername + " left the conversation");
    });
    socket.on('chat', async function(message){
        const { username, text, receiverUsername, receiverSocketId } = message;

        const newMessage = new Message({ sender: username, receiver: receiverUsername, text});
        await newMessage.save();

        io.to(receiverSocketId).emit('chat', message);
    });
});

app.get('/messages/:username', async (req, res) => {
    try{
        const {username} = req.params;
        const messages = await Message.find({ $or: [{ sender: username }, {receiver: username}] });

        res.json(messages);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving messages'});
    }
});
server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
