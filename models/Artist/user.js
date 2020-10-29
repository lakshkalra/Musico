//USER REGISTRATION MODEL
const mongoose = require("mongoose")

const Userschema = new mongoose.Schema({
    name: {
        type: String,
        required: 1
    },
    email: {
        type: String,
        required: 1
    },
    username: {
        type: String,
        required: 1
    },
    password: {
        type: String,
        required: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model("user", Userschema)