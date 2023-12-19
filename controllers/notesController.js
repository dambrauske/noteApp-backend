const userDb = require('../schemas/UserSchema')
const noteDb = require('../schemas/NoteSchema')

const {sendResponse, errorLogging} = require('../controllers/userController')

module.exports = {
    addNote: async (req, res) => {
        const {title, text, color} = data

        const newNote = new noteDb({
            _id: new Types.ObjectId(),
            title,
            text,
            color,
        })


        try {
            await newNote.save()
            const note = await noteDb.findOne({_id: newNote._id})

            sendResponse(res, false, 'Note saved', note)

        } catch (error) {
            errorLogging(error)
            sendResponse(res, true, 'An error occurred', null)
        }

    }
}