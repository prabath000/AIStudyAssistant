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

exports.getQuiz = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        const quiz = await aiService.generateQuiz(note.content);
        const result = await AIResult.create({
            user: req.user._id,
            note: note._id,
            type: 'quiz',
            content: quiz
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPlan = async (req, res) => {
    try {
        const note = await Note.findById(req.params.noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        const plan = await aiService.generateStudyPlan(note.content);
        const result = await AIResult.create({
            user: req.user._id,
            note: note._id,
            type: 'study_plan',
            content: plan
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

exports.generateQuizTopic = async (req, res) => {
    const { subject, topic, count } = req.body;
    try {
        const quiz = await aiService.generateQuizTopic(subject, topic, count || 5);
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.generateStudyPlanTopic = async (req, res) => {
    const { examDate, subjects } = req.body;
    try {
        const plan = await aiService.generateStudyPlanTopic(examDate, subjects);
        res.json({ plan });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

