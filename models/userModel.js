import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()


const mongoURL = process.env.MONGO_URL

mongoose.connect(mongoURL);

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName:{type:String, require:true, unique: true,},
    password: { type: String, required: true },
    email: { type: String, required: true },
    img:{type:String},
    userModel: {} 
});

export const User = mongoose.model('User', UserSchema);


