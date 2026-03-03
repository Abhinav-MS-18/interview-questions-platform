const jwt = require('jsonwebtoken');
const Question = require('../models/Question');

// POST /api/admin/login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (
            username !== process.env.ADMIN_USERNAME ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({ token, message: 'Login successful.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/admin/pending
const getPending = async (req, res) => {
    try {
        const questions = await Question.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json({ questions });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// PUT /api/admin/approve/:id
const approve = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            { status: 'approved' },
            { new: true }
        );
        if (!question) return res.status(404).json({ message: 'Question not found.' });
        res.json({ message: 'Question approved.', question });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// PUT /api/admin/reject/:id
const reject = async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );
        if (!question) return res.status(404).json({ message: 'Question not found.' });
        res.json({ message: 'Question rejected.', question });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// PUT /api/admin/edit/:id
const editQuestion = async (req, res) => {
    try {
        const { company, role, round, questionTypes, difficulty, year, question, answer, status } = req.body;
        const updated = await Question.findByIdAndUpdate(
            req.params.id,
            { company, role, round, questionTypes, difficulty, year, question, answer, status },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: 'Question not found.' });
        res.json({ message: 'Question updated.', question: updated });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// DELETE /api/admin/delete/:id
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) return res.status(404).json({ message: 'Question not found.' });
        res.json({ message: 'Question deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
    try {
        const total = await Question.countDocuments();
        const approved = await Question.countDocuments({ status: 'approved' });
        const rejected = await Question.countDocuments({ status: 'rejected' });
        const pending = await Question.countDocuments({ status: 'pending' });

        // Top companies
        const topCompanies = await Question.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: '$company', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        // Question type breakdown
        const typeBreakdown = await Question.aggregate([
            { $match: { status: 'approved' } },
            { $unwind: '$questionTypes' },
            { $group: { _id: '$questionTypes', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Difficulty breakdown
        const difficultyBreakdown = await Question.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: '$difficulty', count: { $sum: 1 } } },
        ]);

        // Recent submissions per month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const monthlySubmissions = await Question.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        res.json({
            total,
            approved,
            rejected,
            pending,
            topCompanies,
            typeBreakdown,
            difficultyBreakdown,
            monthlySubmissions,
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = { login, getPending, approve, reject, editQuestion, deleteQuestion, getAnalytics };
