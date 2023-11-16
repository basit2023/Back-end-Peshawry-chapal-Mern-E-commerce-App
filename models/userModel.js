import mongoose from 'mongoose';
const userSchema= new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        unique:true,
      },
      phone: {
        type: Number,
      
      },
      address: {
        type: String,
      },
      role: {
        type: Number,
        default: 0,
      },
})
const userModel= mongoose.model("users",userSchema)
export default userModel;
