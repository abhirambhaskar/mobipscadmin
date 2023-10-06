const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const Question = require('../models/question');
const Report = require('../models/report');
const bcrypt = require('bcrypt');
const session = require('express-session');
const Feedback = require('../models/feedback');
// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.adminId) {
        return next();
    } else {
        res.redirect('/admin');
    }
}

// Admin Registration Page
router.get('/admin/register', (req, res) => {
    //res.render('admin-register');
    res.redirect('/admin');
});


router.get('/admin/feedbacks', ensureAuthenticated, async (req, res) => {
    try {
        const feedbacks = await Feedback.find();  // Assuming Feedback is your Mongoose model
       // console.log(feedbacks);  // Log the feedbacks to the console
        res.render('feedback', { feedbacks });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving feedbacks');
    }
});






// Handle Admin Registration
router.post('/admin/register', async (req, res) => {
    const { username, password } = req.body;
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
        return res.status(400).send('Admin with this username already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({ username, password: hashedPassword });
    await admin.save();
    res.redirect('/admin');
});

// Admin Login
router.get('/admin', (req, res) => {
    res.render('admin-login');
});

router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).send('Invalid username or password');
    }

    req.session.adminId = admin.id;
    res.redirect('/admin/dashboard/1');
});

// Admin Logout
router.get('/admin/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
        res.redirect('/admin');
    });
});

// Admin Dashboard with Pagination
router.get('/admin/dashboard/:page', ensureAuthenticated, async (req, res) => {
    const perPage = 10;
    const page = req.params.page || 1;

    try {
        const questions = await Question.find()
                                        .sort({ createdAt: -1 }) // Added this line for sorting
                                        .skip((perPage * page) - perPage)
                                        .limit(perPage);

        const count = await Question.countDocuments();

        res.render('dashboard', {
            questions,
            current: page,
            pages: Math.ceil(count / perPage)
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching the questions');
    }
});


// Adding New Questions
router.get('/admin/questions/new', ensureAuthenticated, (req, res) => {
    res.render('create-question');
});


router.get('/admin/questions/search', async (req, res) => {
    const question = req.query.question;
    try {
        const matchingQuestions = await Question.find({ "question": { $regex: new RegExp(question, 'i') } });
        res.json(matchingQuestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get('/admin/search', async (req, res) => {
    const query = req.query.query.toLowerCase();

    try {
        const questions = await Question.find({
            $or: [
                { question: new RegExp(query, 'i') },
                { answer: new RegExp(query, 'i') }
            ]
        });

        res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while searching');
    }
});


// For fetching reports
router.get('/admin/reports', ensureAuthenticated, async (req, res) => {
    try {
        const reports = await Report.find();  // Use Mongoose model to query database
       // console.log(reports); // Add this line to log the reports data to the console
        res.render('report', { reports });

        
    } catch (error) {
       // console.error(error);
        res.status(500).send('Error retrieving reports');
    }
});

// For deleting reports
router.get('/admin/report/delete/:id', ensureAuthenticated ,async (req, res) => {
    try {
        const { id } = req.params;
        await Report.findByIdAndDelete(id);  // Use Mongoose model to delete a report
        res.redirect('/admin/reports');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting the report');
    }
});

router.post('/admin/questions/new', ensureAuthenticated, async (req, res) => {
    const { question, answer } = req.body;
    const newQuestion = new Question({ question, answer });
    await newQuestion.save();
    res.redirect('/admin/dashboard/1');
});

// Editing Questions
router.get('/admin/questions/edit/:id', ensureAuthenticated, async (req, res) => {
    const question = await Question.findById(req.params.id);
    res.render('edit-question', { question });
});

router.post('/admin/questions/edit/:id', ensureAuthenticated, async (req, res) => {
    const { question, answer } = req.body;
    await Question.findByIdAndUpdate(req.params.id, { question, answer });
    res.redirect('/admin/dashboard/1');
});

// Deleting Questions
router.get('/admin/questions/delete/:id', ensureAuthenticated, async (req, res) => {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard/1');
});

module.exports = router;
