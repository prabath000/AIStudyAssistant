const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadNote, getNotes, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.use(protect);
router.post('/upload', upload.single('file'), uploadNote);
router.get('/', getNotes);
router.delete('/:id', deleteNote);

module.exports = router;
