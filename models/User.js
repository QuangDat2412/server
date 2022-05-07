const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        fullName: { type: String, default: '' },
        phoneNumber: { type: String, default: '' },
        avatar: { type: String, default: '' },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        status: { type: Number, default: 1 },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
