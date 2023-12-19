const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NoteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
}, {
    timestamps: {
        createdAt: true,
    }

})

const Note = mongoose.model('Note', NoteSchema)
module.exports = Note