const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');
//get all notes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const note = await Note.find({ user: req.user.id });
        res.json(note)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})
//add anew note using post
router.post('/addnote', fetchuser, [
    body('title').isLength({ min: 3 }),
    body('description').isLength({ min: 5 })
], async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id

        })
        const savenote = await note.save()
        res.json(savenote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured");
    }
})
//update a note
router.put('/updatenote/:id',fetchuser, async(req,res)=>{
    const {title,description,tag}=req.body;
    //create new note
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};
    //find the note to be updated
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not FOund")}
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");   
    }
    note = await Note.findByIdAndUpdate(req.params.id,{$set: newNote},{new:true})
 res.json({note});
})
//delete a note
router.delete('/deletenote/:id',fetchuser, async(req,res)=>{
    //create new note
    try {
        let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}
    if(note.user.toString() !== req.user.id ){
        return res.status(401).send("Notallowed");
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been deleted",note: note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Interna; Server Error");
    }
    
})
module.exports = router;
