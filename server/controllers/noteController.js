const Note = require('../models/Note');
const pdf = require('pdf-parse');
const fs = require('fs');

exports.uploadNote = async (req, res) => {
    const { title, category } = req.body;
    try {
        let content = '';

        if (!req.user) {
            return res.status(401).json({ message: 'User context missing' });
        }

        if (req.file) {
            console.log(`NoteController: Received file "${req.file.originalname}" (${req.file.mimetype})`);

            try {
                // Use buffer directly (memory storage) — no file path
                const dataBuffer = req.file.buffer;

                if (req.file.mimetype === 'application/pdf') {
                    console.log('NoteController: Parsing PDF content...');
                    const data = await pdf(dataBuffer);
                    content = data.text;
                    console.log(`NoteController: Extracted ${content.length} characters.`);

                    if (!content || content.trim().length === 0) {
                        throw new Error('This PDF appears to be empty or scanned (no selectable text). Please use a document with selectable text.');
                    }
                } else {
                    content = dataBuffer.toString();
                    console.log(`NoteController: Extracted ${content.length} characters from non-PDF.`);
                }
            } catch (err) {
                console.error('NoteController: Extraction error:', err.message);
                return res.status(400).json({ message: err.message });
            }
        } else {
            console.log('NoteController: No file received, using body content.');
            content = req.body.content;
        }

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: 'No content could be extracted from this document.' });
        }

        const note = await Note.create({
            user: req.user._id,
            title,
            content,
            category,
            fileName: req.file ? req.file.originalname : 'Manual Entry'
        });

        console.log(`NoteController: Note created successfully with ID: ${note._id}`);
        res.status(201).json(note);

    } catch (error) {
        console.error('NoteController: Global Error:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        if (note.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        await note.deleteOne();
        res.json({ message: 'Note removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
