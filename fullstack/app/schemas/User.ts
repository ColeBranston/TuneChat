const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = mongoose.models.User || mongoose.model('User', new Schema({
    email: { type: String, required: true, unique: true },
    id: { type: String, required: true, unique: true },
    chatroom: { type: String },
    profile_pic: { type: String },
    image: { type: String }
}));

module.exports = User;
