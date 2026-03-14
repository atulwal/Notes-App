import { Notes } from "../models/notes.model.js";
import { ApiRes } from "../utils/ApiRes.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createNotes = asyncHandler(async (req, res) => {
    const {title, content, user} = req.body
    const note = await Notes.create({
        title, content, user: req.user._id
    })
    res.status(201).json(
        new ApiRes(201, note, "Note created succsessfully")
    )
})

const getNotes = asyncHandler(async (req, res) => {
    const notes = await Notes.find({user: req.user._id})
    res.status(200).json(
        new ApiRes(200, notes, "Notes fetched successfully")
    )
})

const deleteNotes = asyncHandler(async (req, res) => {
    const {id} = req.params
    const note = await Notes.findByIdAndDelete(id)
    res.status(200).json(
        new ApiRes(200, note, "Note deleted successfully")
    )
})

export {
    createNotes,
    getNotes, 
    deleteNotes
}