const userDb = require('../schemas/UserSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Types} = require('mongoose')

const sendResponse = (res, errorValue, messagevalue, dataValue) => {
    res.send({
        error: errorValue,
        message: messagevalue,
        data: dataValue,
    })
}

const errorLogging = (myError) => {
    console.error(`Error (${myError.code}): ${myError.message}`)
}

module.exports = {
    register: async (req, res) => {
        const {email, name, password} = req.body

        const emailAlreadyRegistered = await userDb.findOne({email: email})

        if (emailAlreadyRegistered) {
            return sendResponse(res, true, 'Email already registered', null)
        }

        const hash = await bcrypt.hash(password, 13)

        const newUser = new userDb({
            _id: new Types.ObjectId(),
            email,
            password: hash,
            name,
        })

        const userToken = {
            _id: newUser._id,
            name: newUser.name,
        }

        const token = jwt.sign(userToken, process.env.JWT_SECRET)

        try {
            await newUser.save()
            sendResponse(res, false, 'User saved', {
                token,
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                }
            })

        } catch (error) {
            errorLogging(error)
            sendResponse(res, true, 'An error occurred', null)
        }

    },
    login: async (req, res) => {

        const {email, password} = req.body

        try {
            const userInDb = await userDb.findOne({email: email})

            if (!userInDb) {
                return sendResponse(res, true, 'Wrong credentials', null)
            }

            const isValid = await bcrypt.compare(password, userInDb.password)

            if (!isValid) {
                return sendResponse(res, true, 'Wrong credentials', null)
            }

            const userToken = {
                _id: userInDb._id,
                email: userInDb.email,
            }

            const token = jwt.sign(userToken, process.env.JWT_SECRET)
            const user = await userDb.findOne({_id: userInDb._id}).select('-password -email')
            sendResponse(res, false, 'User found', {
                token,
                user,
            })

        } catch (error) {
            errorLogging(error)
            sendResponse(res,true, 'An error occurred', null)
        }
    },
}