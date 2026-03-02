const Note = require('../models/Note');
const AIResult = require('../models/AIResult');
const aiService = require('../services/aiService');

exports.getSummary = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        const summary = await aiService.generateSummary(note.content);
        const result = await AIResult.create({
            user: req.user._id,
            note: note._id,
            type: 'summary',
            content: summary
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.chat = async (req, res) => {
    const { history, message, noteId } = req.body;
    try {
        let documentContent = "";
        if (noteId) {
            const note = await Note.findById(noteId);
            if (note) {
                documentContent = note.content;
            }
        }

        const response = await aiService.chatTutor(history, message, documentContent);
        res.json({ response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.generateNotes = async (req, res) => {
    const { topic } = req.body;
    try {
        const notes = await aiService.generateNotesTopic(topic);
        res.json({ notes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.processWritingTask = async (req, res) => {
    const { taskType, content } = req.body;
    try {
        if (!content) return res.status(400).json({ message: 'Content is required' });
        const response = await aiService.processWritingTask(taskType, content);
        res.json({ response });
    } catch (error) {
        require('fs').appendFileSync('ai_errors.log', `${new Date().toISOString()} - ERROR in processWritingTask [${taskType}]: ${error.message}\n${error.stack}\n\n`);
        res.status(500).json({ message: error.message });
    }
};

exports.generateQuiz = async (req, res) => {
    const { subject, topic, count } = req.body;
    try {
        const questions = await aiService.generateQuizTopic(subject, topic, count);
        res.json({ questions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.generateStudyPlan = async (req, res) => {
    const { examDate, subjects } = req.body;
    try {
        const plan = await aiService.generateStudyPlanTopic(examDate, subjects);
        res.json({ plan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuiz = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        const quiz = await aiService.generateQuizDocument(note.content);

        // Save result
        await AIResult.create({
            user: req.user._id,
            note: note._id,
            type: 'quiz',
            content: quiz
        });

        res.json({ content: quiz });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


