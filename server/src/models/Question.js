const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
    {
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Job role is required'],
            trim: true,
        },
        round: {
            type: String,
            required: [true, 'Interview round is required'],
            enum: ['Resume Screening', 'Online Assessment', 'Technical Round 1', 'Technical Round 2', 'System Design', 'HR Round', 'Manager Round', 'Other'],
        },
        questionTypes: {
            type: [String],
            required: [true, 'At least one question type is required'],
            enum: ['DSA', 'System Design', 'Behavioural', 'Problem Solving', 'Technical Concepts', 'Project Discussion', 'Aptitude', 'Other'],
        },
        difficulty: {
            type: String,
            required: [true, 'Difficulty is required'],
            enum: ['Easy', 'Medium', 'Hard'],
        },
        year: {
            type: Number,
            required: [true, 'Year is required'],
        },
        question: {
            type: String,
            required: [true, 'Question description is required'],
            trim: true,
        },
        answer: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

// Indexes for fast filtering
questionSchema.index({ company: 1 });
questionSchema.index({ role: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ status: 1 });
questionSchema.index({ year: 1 });
questionSchema.index({ round: 1 });
questionSchema.index({ questionTypes: 1 });
questionSchema.index({ question: 'text' }); // text search

module.exports = mongoose.model('Question', questionSchema);
