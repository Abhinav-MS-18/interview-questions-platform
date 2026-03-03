const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  questionTypes: {
    type: [String],
    required: true,
    enum: ['DSA', 'System Design']
  }
});
const Question = mongoose.model('Question', questionSchema);
const q = new Question({ questionTypes: ['DSA', 'Other'] });
q.validate().then(() => console.log('OK')).catch(e => console.log('ERROR:', e.message));
