const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://abhi:YKcOBneOYEQEXThk@cluster0.fyirfwg.mongodb.net/quiz?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //  console.log("Connected to MongoDB");
});

module.exports = db;
