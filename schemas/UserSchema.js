const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    }, 
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('notes-app-users', UserSchema)
module.exports = User