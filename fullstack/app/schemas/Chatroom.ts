const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;

const ChatroomSchema = new Schema({
    chatroom: { type: String, required: true, unique: true, default: uuidv4 },
    chat_history: { type: [String] }
});

const Chatroom = mongoose.models.Chatroom || mongoose.model('Chatroom', ChatroomSchema);

module.exports = Chatroom;
