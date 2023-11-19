import { connect, Schema, model } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
connect(process.env.MONGO_URL);

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    userModel: {} 
});

const User = model('User', UserSchema);

export default User;
