const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')

const getAllNotes = asyncHandler( async (req, res) => {
  // const { currentUser } = req.body

  //check if user exists
  // const foundUser = await User.findById(currentUser).exec()
  // if(!foundUser){
  //   return res.status(400).json({ message: 'User not found'})
  // }

  //if user has role
  // const userRole = await User.findById(currentUser).select(roles).lean()
  // if(!Array.isArray(userRole)){
  //   return res.status(401).json({ message: 'User has no role'})
  // }

  //check if user's role can is allowed for access
  // if(!userRole.includes('Manager') || !userRole.includes('Admin') || !userRole.includes('Employee')){
  //   return res.status(401).json({ message: 'User not authorized'})
  // }
  
  // if(userRole.includes('Employee')){
  //   const notes = await Note.find().lean()
  //   if( !notes?.length ){
  //     return res.status(400).json({message: 'No notes found'})
  //   }
  //   res.json(notes)
  // }

  // if(userRole.includes('Manager') || userRole.includes('Admin')){
  //   const notes = await Note.find().lean()
  //   if( !notes?.length ){
  //     return res.status(400).json({message: 'No notes found'})
  //   }
  //   res.json(notes)
  // }

  // Get all notes from MongoDB
  const notes = await Note.find().lean()

  // If no notes 
  if (!notes?.length) {
    return res.status(400).json({ message: 'No notes found' })
  }

  // Add username to each note before sending the response 
  // You could also do this with a for...of loop
  const notesWithUser = await Promise.all(notes.map(async (note) => {
    const user = await User.findById(note.user).lean().exec()
    return { ...note, username: user.username }
  }))

  res.json(notesWithUser)
})

const createNewNote = asyncHandler( async (req, res) => {
  const { user, customer, title, text } = req.body

  if(!user || !customer || !title || !text){
    return res.status(400).json({ message: 'All fields are required' })
  }
  
  // const foundUser = await User.findById(user).exec()

  // if(!foundUser) {
  //   return res.status(400).json({ message: 'User not found' })
  // }



  const noteObject = { user, customer, title, text }
  const note = await Note.create(noteObject)

  if(note){
    res.status(201).json({ message: `New note ${title} created`})
  }else{
    res.status(400).json({ message: 'Invalid note data received'})
  }
})

const updateNote = asyncHandler( async (req, res) => {
  const { id, user, customer, title, text, completed } = req.body

  if( !id || !user || !customer || !title || !text || !completed){
    return res.status(400).json({ message: 'All fields are required'})
  }
  //check if note exists
  const note = await Note.findById(id).exec()
  if(!note){
    return res.status(400).json({ message: 'Note not found'})
  }

  // //check if user exists
  // const foundUser = await User.findById(user).exec()
  // if(!foundUser){
  //   return res.status(400).json({ message: 'User not found'})
  // }

  // //check if user's role can is allowed for
  // const userRole = await User.findById(user).select(roles).lean()

  // if(!userRole.includes('Manager') || !userRole.includes('Admin')){
  //   return res.status(401).json({ message: 'User not authorized'})
  // }

  note.user = user
  note.customer = customer
  note.title = title
  note.text = text
  note.completed = completed

  const updatedNote = await note.save()

  res.json(`Note with ID:${updatedNote.id} updated`)
})

const deleteNote = asyncHandler( async (req, res) => {
  const { id } = req.body

  if(!id){
    return res.status(400).json({message: 'Note ID required'})
  }

  const fetchNote = Note.findById(id).exec()
  if(!fetchNote){
    return res.status(400).json({ message: 'Note not found'})
  }

  const result = await fetchNote.deleteOne()

  const reply = `Note "${result.title}" with ID ${result._id} deleted`

  res.json(reply)
})

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote }