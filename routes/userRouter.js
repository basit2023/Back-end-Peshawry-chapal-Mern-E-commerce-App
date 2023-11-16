import express from 'express'
const Router= express.Router()
import {registerController,loginController,
        getOrdersController, getAllOrdersController,
         forgetPasswordController, resetPasswordController,
        verifyOTP,orderStatusController,
        createOrder} from '../controllers/userController.js'
import { requireSignIn,isAdmin } from '../middlewares/authMiddleware.js'
//Register controller
Router.post('/register' ,registerController)
Router.post('/login' ,loginController) 

//forget password controller
Router.post('/forget',forgetPasswordController)
//reset password
Router.post('/reset',resetPasswordController)
Router.post('/otp',verifyOTP)

//order
Router.post('/createorder',requireSignIn, createOrder)
Router.get('/orders',requireSignIn,getOrdersController)
Router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersController)
Router.put(
        "/order-status/:orderId",
        requireSignIn,
        isAdmin,
        orderStatusController
      );


Router.get("/user-auth", requireSignIn, (req, res) => {
        res.status(200).send({ ok: true });
      });

//admin protect route
Router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
        res.status(200).send({ ok: true });
      });


export default Router;