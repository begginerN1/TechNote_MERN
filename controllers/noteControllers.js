const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find().lean();
    if (!notes?.length) {
        return res.status(400).json({ message: 'No notes found' })
    }
    
    const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
});


// @desc Create New Note
// @route POST /Notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;
    
    // confirm data
    if (!user || !title || text) {
        return res.status(400).json({ message: 'all fields are required' });
    }

    //check for duplicates
    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: 'duplicate username' });
    }

    //hash password

    
    //create and save a new user
    const note = await Note.create({user,title,text});

    if (note) {
        res.status(201).json({message: 'note created'})
    } else {
        res.status(400).json({ message: 'invalid note data received' });
    }

})


// @desc Update a note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body;

    //confirm data
    if (!id || !user || title || text || typeof completed !== 'boolean') {
        return res.status(400).json({message:'all fields are required'})
    }

    const note = await Note.findById(id).exec();
    if (!note) {
        return res.status(400).json({ message: 'note not found' })
    }

    // check for duplicate
    const duplicate = await Note.findOne({ title }).lean().exec();
    //allow updates to the original user
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({message:'duplicate note title'})
    }
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    if (password) {
        //hash password
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedNote = await note.save();

    res.json({ message: 'note updated successfully' });
})


// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: 'note ID required' });
    }

    const note = await Note.findById(id).exec();

    if (!note) {
        return res.status(400).json({message:'note not found'})
    }

    await note.deleteOne();

    res.json({message:"note has been deleted"})
})

module.exports={deleteNote, getAllNotes, createNewNote, updateNote}
