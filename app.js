const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const indexRouter = require('./routes/index');
const session = require('express-session');
const path = require('path');  // Added this line to import the path module

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

// Sample code to find and sort questions
const Question = require('./models/question');

Question.find().sort({ createdAt: -1 }).exec((err, questions) => {
    if (err) {
        // Handle error here
    } else {
        // Handle the sorted questions here
    }
});

// Using express-session middleware
app.use(session({
    secret: '0dgPNMzH6sYG4iMaCL0jdTFsJNEq6Mz2df1APkey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
