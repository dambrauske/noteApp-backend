const userDb = require("../schemas/UserSchema");
const noteDb = require("../schemas/NoteSchema");
const { Types } = require("mongoose");

const { sendResponse, errorLogging } = require("../helperFunctions");

module.exports = {
  addNote: async (req, res) => {
    const { title, text, color } = req.body;
    const user = req.user;

    console.log("data", req.body);
    console.log("user", user);

    const newNote = new noteDb({
      _id: new Types.ObjectId(),
      user: user._id,
      title,
      text,
      color,
    });

    try {
      await newNote.save();
      const notes = await noteDb.find({ user: user._id });
      console.log("notes", notes);
      sendResponse(res, false, "Note saved", notes);
    } catch (error) {
      errorLogging(error);
      sendResponse(res, true, "An error occurred", null);
    }
  },
};
