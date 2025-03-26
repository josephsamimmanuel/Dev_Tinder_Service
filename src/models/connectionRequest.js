const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: '{VALUE} is not a valid status'
        },
        default: 'interested',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

connectionRequestSchema.pre('save', async function(next) {
    const connectionRequest = this
    // Check if the fromUserId and toUserId are the same
    if(connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        throw new Error('Cannot send a connection request to yourself')
    }
    next()
})

// Create a unique index on the fromUserId and toUserId fields
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true })

const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequestModel;
