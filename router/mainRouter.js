const express = require('express')
const router = express.Router()

const {
    register,
    login,
    getUser,
} = require('../controllers/userController')

const {
    addNote,
    deleteNote,
    updateNote,
    getNotes,
} = require('../controllers/notesController')

const {
    validateToken
} = require('../middleware/tokenValidation')

router.post('/register', register)
router.post('/login', login)
router.post('/addNote', validateToken, addNote)
router.post('/deleteNote', validateToken, deleteNote)
router.post('/updateNote', validateToken, updateNote)
router.get('/notes', validateToken, getNotes)
router.get('/user', validateToken, getUser)

module.exports = router