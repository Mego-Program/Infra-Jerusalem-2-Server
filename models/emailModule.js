import mongoose from "mongoose";



const EmailsSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: Number, required: true },
    verify:{type:Boolean,require:true}

  });
  
  export const Email = mongoose.model("Emails", EmailsSchema);