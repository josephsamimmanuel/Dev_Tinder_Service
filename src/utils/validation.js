const validator = require('validator')
const bcrypt = require('bcrypt')

const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body
    if (!firstName || !lastName ) {
        throw new Error('Name fields are mandatory')
    }
    else if(firstName.length < 5 || firstName.length > 20) {
        throw new Error('First Name should be between 5 to 20 characters')
    }
    else if(lastName.length < 5 || lastName.length > 20) {
        throw new Error('Last Name should be between 5 to 20 characters')
    }
    else if (!validator.isEmail(emailId)) {
        throw new Error('Email is not valid')
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong')
    }
};

const validateUpdateProfileData = (req) => {
    console.log(req.body)
    const allowedFields = ['firstName', 'lastName', 'age', 'gender', 'photoUrl', 'about', 'skills']    
    const isEditAllowed = Object.keys(req.body).every(field => allowedFields.includes(field))
    console.log(isEditAllowed)
    if(!isEditAllowed) {
        throw new Error('Invalid fields. Email and password cannot be editted')
    }
    return isEditAllowed
};

const validateUpdatePasswordData = async (req) => {
    const { password } = req.body
    const user = req.user
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(isPasswordMatch) {
        throw new Error('New password cannot be the same as the old password')
    }
    if(!password) {
        throw new Error('Password is required')
    }
    if(!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong')
    }
    return true
}


module.exports = {
    validateSignupData,
    validateUpdateProfileData,
    validateUpdatePasswordData
}