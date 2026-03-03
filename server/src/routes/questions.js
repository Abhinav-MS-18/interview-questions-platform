const express = require('express');
const router = express.Router();
const { submitQuestion, getQuestions, getStats } = require('../controllers/questionController');

router.post('/', submitQuestion);
router.get('/', getQuestions);
router.get('/stats', getStats);

module.exports = router;
