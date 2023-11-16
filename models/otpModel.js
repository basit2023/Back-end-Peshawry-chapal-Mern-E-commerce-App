import mongoose from 'mongoose';

// Define a schema for OTPs
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1h', 
  },
});
export default mongoose.model('otps',otpSchema)