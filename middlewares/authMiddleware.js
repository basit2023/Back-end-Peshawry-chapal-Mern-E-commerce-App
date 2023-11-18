import jwt from "jsonwebtoken"
import userModel from './../models/userModel.js';

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "You are not logged in! Kindly logged in first",
      });
    }

    
  try {
    
    const decode = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    
    console.log(error);
  }
};


//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};
