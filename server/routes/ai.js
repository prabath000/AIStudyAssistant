const express = require('express');
const router = express.Router();
const {
    getSummary,
    chat,
    generateNotes,
    processWritingTask,
    generateQuiz,
    generateStudyPlan,
    getQuiz
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/summarize/:noteId', getSummary);
router.post('/quiz/:noteId', getQuiz);
router.post('/chat', chat);
router.post('/generate-notes', generateNotes);
router.post('/writing-task', processWritingTask);
router.post('/generate-quiz', generateQuiz);
router.post('/study-plan', generateStudyPlan);

module.exports = router;

