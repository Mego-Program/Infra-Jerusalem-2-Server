import mongoose from "mongoose";



const EmailsSchema = new mongoose.Schema({
    email: { type: String, required: true },
    code: { type: Number, required: true },

  });
  
  export const Email = mongoose.model("Emails", EmailsSchema);