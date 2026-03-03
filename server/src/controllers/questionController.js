const Question = require('../models/Question');

// POST /api/questions - Submit a new question
const submitQuestion = async (req, res) => {
    try {
        const { company, role, round, questionTypes, difficulty, year, question, answer } = req.body;

        if (!company || !role || !round || !questionTypes?.length || !difficulty || !year || !question) {
            return res.status(400).json({ message: 'Please fill in all required fields.' });
        }

        const newQuestion = new Question({
            company,
            role,
            round,
            questionTypes,
            difficulty,
            year: parseInt(year),
            question,
            answer: answer || '',
            status: 'pending',
        });

        await newQuestion.save();
        res.status(201).json({ message: 'Question submitted successfully! It will appear after review.', question: newQuestion });
    } catch (error) {
        console.error('Submit question error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// GET /api/questions - Browse approved questions with filters
const getQuestions = async (req, res) => {
    try {
        const {
            company,
            role,
            round,
            difficulty,
            year,
            questionType,
            keyword,
            page = 1,
            limit = 12,
        } = req.query;

        const filter = { status: 'approved' };

        if (company) filter.company = { $regex: company, $options: 'i' };
        if (role) filter.role = { $regex: role, $options: 'i' };
        if (round) filter.round = round;
        if (difficulty) filter.difficulty = difficulty;
        if (year) filter.year = parseInt(year);
        if (questionType) {
            // questionType can be comma-separated
            const types = questionType.split(',').map(t => t.trim());
            filter.questionTypes = { $in: types };
        }
        if (keyword) {
            filter.$text = { $search: keyword };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Question.countDocuments(filter);
        const questions = await Question.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            questions,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        });
    } catch (error) {
        console.error('Get questions error:', error);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};

// GET /api/stats - Get platform stats
const getStats = async (req, res) => {
    try {
        const totalQuestions = await Question.countDocuments({ status: 'approved' });
        const companiesCount = await Question.distinct('company', { status: 'approved' });
        const rolesCount = await Question.distinct('role', { status: 'approved' });

        res.json({
            totalQuestions,
            companies: companiesCount.length,
            roles: rolesCount.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = { submitQuestion, getQuestions, getStats };
