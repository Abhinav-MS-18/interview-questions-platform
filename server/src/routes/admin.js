const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    login,
    getPending,
    approve,
    reject,
    editQuestion,
    deleteQuestion,
    getAnalytics,
} = require('../controllers/adminController');

// Public
router.post('/login', login);

// Protected
router.get('/pending', authMiddleware, getPending);
router.put('/approve/:id', authMiddleware, approve);
router.put('/reject/:id', authMiddleware, reject);
router.put('/edit/:id', authMiddleware, editQuestion);
router.delete('/delete/:id', authMiddleware, deleteQuestion);
router.get('/analytics', authMiddleware, getAnalytics);

module.exports = router;
