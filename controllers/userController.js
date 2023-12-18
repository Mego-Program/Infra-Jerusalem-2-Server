import { User } from "../models/userModel.js";
import mongoose from "mongoose";

 const getUserImg = async (req, res) => {
  try {
    const { userName } = req.body;
    const user = await User.findOne({ userName: userName });

    if (!user) {
      return res.status(500).send({ auth: false, message: "user not exist" });
    }
    return res
      .status(200)
      .send({ userName: user.firstName + " " + user.lastName, imag: user.img });
  } catch (error) {
    console.log(error);
  }
};


 const getAllUsersInfo = async (req, res) => {
    try {
      const users = await User.find({});

  
      if (!users || users.length === 0) {
        return res.status(500).send({ auth: false, message: "No users found" });
      }
  
      const usersInfo = users.map(user => ({
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        img: user.img
      }));
  
      return res.status(200).send(usersInfo);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  };
const getAllUserDetails = async( req,res) =>{
    try{
    const {name} = req.body
    console.log(name,"ygvbhunbvftcdrftvgby");
    const user = await User.findOne({ userName:name });
    console.log(user);
    if (!user) {
        return res.status(500).send({ auth: false, message: "user not exist" });
      }
      return res
        .status(200)
        .send(user);


    }
    catch(error){
        console.log(error);
    }


}
 const setImg = async (req,res)=>{
    const { name,img } = req.body;


    try {
        
        const user = await User.findOne({ userName: userName });
    
        if (!user) {
          return res.status(500).send({ auth: false, message: "user not exist" });
        }
        user.img = img

        user.save()

        return res
          .status(200)
          .send("img set sucssefuly");
      } catch (error) {
        console.log(error);
      }


    
}


export  {getAllUserDetails,getAllUsersInfo,getUserImg,setImg} ;
