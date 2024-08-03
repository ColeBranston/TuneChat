import mongoose from "mongoose";

const { Schema } = mongoose;
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    messages: { // change later, just for testing now
        type: String,
        required: true
    }
})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;