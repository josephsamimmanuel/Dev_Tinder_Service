const validator = require('validator')

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

module.exports = {
    validateSignupData
}