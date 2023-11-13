const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    userModel: {} 
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
