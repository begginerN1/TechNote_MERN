const router = require('express').Router();
const {deleteNote, getAllNotes, createNewNote, updateNote} = require('../controllers/noteControllers');

router.route('/')
    .get(getAllNotes)
    .post(createNewNote)
    .patch(updateNote)
    .delete(deleteNote)


module.exports = router;