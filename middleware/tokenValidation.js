const { sendResponse, errorLogging } = require("../helperFunctions");
const jwt = require('jsonwebtoken')

module.exports = {
    validateToken: (req, res, next) => {
        const token = req.headers.authorization
        console.log("token", token)

        jwt.verify(token, process.env.JWT_SECRET, (error, data) => {
            if (error) {
                return sendResponse(res, true, "Token error", null)
            }

            req.user = data

            next()
        })
    }
}