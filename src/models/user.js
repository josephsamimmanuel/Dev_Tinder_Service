// Create User Schema and User Models

const mongoose = require('mongoose');   // npm install mongoose
var validator = require('validator');   // npm install validator

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20
    },
    lastName: {
        type: String,
        // required: true   Data Sanitization is not required
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 65
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        // validate: {
        //     validator: function(email) {
        //         return /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/.test(email);
        //     },
        //     message: props => `${props.value} is not a valid email id`
        // },
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Email is not valid");
            }
        },
        trim: true,
    },
    password: {
        type: String,
        required: true,
        validate(password) {
            if (!validator.isStrongPassword(password)) {
                throw new Error("Password is not strong");
            }
        },
    },
    gender: {
        type: String,
        validate: {
            validator: function (gender) {
                if (!["male", "female", "others"].includes(gender.toLowerCase())) {
                    throw new Error("Gender should be valid")
                }
            }
        },
    },
    photoUrl: {
        type: String,
        default: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200'
    },
    about: {
        type: String,
        default: 'Hey there! I am using WhatsApp'
    },
    skills: {
        type: Array,
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;