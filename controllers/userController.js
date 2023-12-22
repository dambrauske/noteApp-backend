const userDb = require("../schemas/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Types } = require("mongoose");
const { sendResponse, errorLogging } = require("../helperFunctions");

module.exports = {
  register: async (req, res) => {
    console.log(req.body)
    const { email, name, password } = req.body;

    const emailAlreadyRegistered = await userDb.findOne({ email: email });

    if (emailAlreadyRegistered) {
      return sendResponse(res, true, "Email already registered", null);
    }

    const hash = await bcrypt.hash(password, 13);

    const newUser = new userDb({
      _id: new Types.ObjectId(),
      email,
      password: hash,
      name,
    });

    const userToken = {
      _id: newUser._id,
      name: newUser.name,
    };

    const token = jwt.sign(userToken, process.env.JWT_SECRET);

    try {
      await newUser.save();
      const userInDb = await userDb.findOne({ _id: newUser._id });
      console.log(userInDb)

      sendResponse(res, false, "User saved", {
        token,
        user: {
          _id: newUser._id,
          name: newUser.name,
        },
      });
    } catch (error) {
      errorLogging(error);
      sendResponse(res, true, "An error occurred", null);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const userInDb = await userDb.findOne({ email: email });

      if (!userInDb) {
        return sendResponse(res, true, "Wrong credentials", null);
      }

      const isValid = await bcrypt.compare(password, userInDb.password);

      if (!isValid) {
        return sendResponse(res, true, "Wrong credentials", null);
      }

      const userToken = {
        _id: userInDb._id,
        email: userInDb.email,
      };

      const token = jwt.sign(userToken, process.env.JWT_SECRET);
      const user = await userDb
        .findOne({ _id: userInDb._id })
        .select("-password -email");
      sendResponse(res, false, "User found", {
        token,
        user,
      });
    } catch (error) {
      errorLogging(error);
      sendResponse(res, true, "An error occurred", null);
    }
  },
  getUser: async (req, res) => {
    const user = req.user;

    try {
      const userData = await userDb
        .findOne({ _id: user._id })
        .select("-password -email");
      sendResponse(res, false, "User found", userData);
    } catch (error) {
      errorLogging(error);
      sendResponse(res, true, "User not found", null);
    }
  },
};
