const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

const Schema = mongoose.Schema;

const User = mongoose.models.User || mongoose.model('User', new Schema({
    email: { type: String, required: true, unique: true },
    id: { type: String, required: true, unique: true },
    chatroom: { type: String, default: uuidv4},
    profile_pic: { type: String }
}));

module.exports = User;
