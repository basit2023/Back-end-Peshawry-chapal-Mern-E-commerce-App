import userModel from "../models/userModel.js";
import { hashPassword,comparePassword } from "../Auth/authHelper.js";
import jwt from "jsonwebtoken";
import orderModel from "../models/orderModel.js";
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import otpModel from "../models/otpModel.js";
// import { useRef } from 'react';
export const registerController = async (req,res) =>{
    try {
        // const { name, email, password, phone, address } = req.body;
        const { name, email, password, phone, address } = req.body;
        //validations
        if (!name) { 
            return res.send({ error: "Name is Required" });
        }
        if (!email) {
            return res.send({ message: "Email is Required" });
        }
        if (!password) {
            return res.send({ message: "Password is Required" });
        }
        // if (!phone) {
        //     return res.send({ message: "Phone no is Required" });
        // }
        // if (!address) {
        //     return res.send({ message: "Address is Required" });
        // }
        // if (password !== confirmPassword){
        //     return res.status(409).json({message:"Password not matched"})
        //  }
        //check user
       const existingUser= await userModel.findOne({email})
        if(existingUser){
            return res.status(200).send({
                success: false,
                message: "Already Register please login",
              })
        }
        //hashed passwaord
        const hashedPassword = await hashPassword(password);
        //Register new user
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password:hashedPassword,
          }).save();
          res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
          })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Registeration",
            error,
          });
    }
}
//log in controller
export const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
     
      // Validation
      if (!email || !password) {
        return res.status(400).send({
          success: false,
          message: "Invalid email or password",
        });
      }
  
      // Check if the user with the given email exists
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Email is not registered",
        });
      }
  
      // Compare the entered password with the hashed password stored in the database
      const isPasswordMatch = await comparePassword(password, user.password);
  
      if (!isPasswordMatch) {
        return res.status(400).send({
          success: false,
          message: "Invalid email or password", 
        });
      }
  
      // Generate a JWT token for the authenticated user
      const token = await jwt.sign(    
        { _id: user._id,email: user.email
         },
        process.env.JWT_SECRET || 'thisisme123', 
        // { expiresIn: "24hr" }
      );
      console.log(token);
      res.status(200).send({
        success: true,
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login",
        error,
      });
    }
  };


  // for get password
  export const forgetPasswordController = async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).send({ message: 'Email is required' });
      }
  
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'The email is not registered, please try another',
        });
      }
      const user_otp= await otpModel.find({email:email})
      if(user_otp[0]){
        await otpModel.findOneAndDelete({email:email})
      }
      const otp = crypto.randomBytes(3).toString('hex'); // Adjust the length as needed
      console.log(otp)
      // Save OTP to the database
      const saveOTP = async (email, otp) => {
        const otpDocument = new otpModel({ email, otp });
        await otpDocument.save();
        res.status(200).send({
          success: true, 
          message: 'OTP send to your email',
        });
      };
      await saveOTP(email, otp); // Execute the saveOTP function
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: 'Something went wrong',
        error,
      });
    }
  };
  // export const forgetPasswordController = async (req, res) => {
  //   try {
  //     const { email } = req.body;
  //     if (!email) {
  //       return res.status(400).send({ message: 'Email is required' });
  //     }
  
  //     const user = await userModel.findOne({ email });
  //     if (!user) {
  //       return res.status(404).send({
  //         success: false,
  //         message: 'The email is not registered, please try another',
  //       });
  //     }
  
  //     const otp = crypto.randomBytes(3).toString('hex'); // Adjust the length as needed
  
  //     const transporter = nodemailer.createTransport({
  //       service: 'hotmail',
  //       auth: {
  //         user: 'engr.basitkhan@outlook.com',
  //         pass: 'Basit0303#',
  //       },
  //     });
  
  //     const mailOptions = {
  //       from: 'engr.basitkhan@outlook.com',
  //       to: email,
  //       subject: 'Password Reset OTP',
  //       text: `Your OTP is ${otp}`,
  //     };
  
  //     transporter.sendMail(mailOptions, (error, info) => {
  //       if (error) {
  //         console.log(error);
  //         return res.status(500).send({
  //           success: false,
  //           message: 'Something went wrong with sending the email',
  //           error,
  //         });
  //       } else {
  //         console.log('Email sent: ' + info.response);
  //         // Save OTP to the database
  //         const saveOTP = async (email, otp) => {
  //           const otpDocument = new OTPModel({ email, otp });
  //           await otpDocument.save();
  //           res.status(200).send({
  //             success: true,
  //             message: 'OTP sent to your email',
  //           });
  //         };
  //         saveOTP(email, otp); // Execute the saveOTP function
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send({
  //       success: false,
  //       message: 'Something went wrong',
  //       error,
  //     });
  //   }
  // };


  // update possward
  export const verifyOTP= async (req,res) =>{
         try {
          const {email, otp, newPassword}=req.body;
          console.log(`the email is: ${email}, otp is:${otp}, and newpassword is:${newPassword}`);
          if(!email){
           res.status(404).send({success:false, message:"Enter your email"})
          }
          if(!otp){
           res.status(404).send({success:false, message:"Enter your otp that send to email"})
          }
          if(!newPassword){
            res.status(404).send({success:false, message:"Enter New password"})
           }
          const user_otp= await otpModel.find({email:email})
          const user = await userModel.findOne({ email });
          console.log("the db otp is:",typeof(user_otp[0].otp))
          console.log("before match:",typeof (otp))
  
          if(otp===user_otp[0].otp){ 
            console.log("After match:",otp)
           console.log("OTP mached");
           const hash= await hashPassword(newPassword);
           await userModel.findByIdAndUpdate(user._id,{password:hash})
           await otpModel.findOneAndDelete({email:email})
           res.status(201).send({
             success:true,
             message: "Password update successfully"
       });
      }
         
        }catch (error) {
          console.log(error);
          res.status(500).send({
            success: false,
            message: "Something went wrong",
            error,
          });
         }

 
        
  }
  //reset password
  export const resetPasswordController = async (req, res) => {
    try {
      const { email, password, newPassword } = req.body;
      if (!email) { 
        return res.status(400).json({ success: false, message: "Email is required" });
      }
      if (!password) {
        return res.status(400).json({ success: false, message: "Password is required" });
      }
  
      // Find the user by email
      const user = await userModel.findOne({ email });
      //user exists
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      // Compare password
      const passwordMatch = await comparePassword(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ success: false, message: "The old password is not matched" });
      }
  
      // Update password
      user.password = newPassword;
      await user.save();
  
      return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Something went wrong", error });
    }
  };
  

export const createOrder= async(req,res)=>{
       try {
        const {productId, payment, buyer,status}= req.body;
        await new orderModel(req.body).save()
        res.status(201).send({success:true, message:"Your order created Successfully"})
       } catch (error) {
        console.log(error)
        res.status(404).send({success:false, message:"Something went wrong while creating order"})
       }
       
}


export const getOrdersController = async (req, res) => {
  try {
    const {userId} = req.user;
    const orders = await orderModel
      .find({ buyer: userId })
      .populate("products", "-photo")
      .populate("buyer", "name");

    

    res.json(orders); 
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

  //orders
export const getAllOrdersController = async (req, res) => {
    try {
      const orders = await orderModel
        .find({})
        .populate("products", "-photo")
        .populate("buyer", "name")
        .sort({ createdAt: "-1" });
      res.json(orders);
    
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error WHile Geting Orders",
        error,
      });
    }
  };



  export const orderStatusController= async (req,res) => {
    try {
        const {orderId}=req.params;
        const { status }= req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,{status},{new:true}
        );
        res.json(orders)
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
          })
    }
  }
  
  //update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        email:email,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};
