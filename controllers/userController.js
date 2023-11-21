import { User } from "../models/userModel.js";
import mongoose from "mongoose";


const  getUserImg =  async(req,res)=>{
        try{
     const {userName} = req.body
     const user = await User.findOne({ userName: userName });

     if (!user){
        return res.status(500).send({ auth: false, message: "user not exist" });

     }
     return res.status(200).send({userName: user.firstName + ' '+ user.lastName,imag:user.img })




        }
        catch(error){

            console.log(error);

        }
    }

export default getUserImg

