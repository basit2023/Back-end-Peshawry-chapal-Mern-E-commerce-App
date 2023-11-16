import mongoose from "mongoose";
import express from 'express'
import {requireSignIn,isAdmin} from '../middlewares/authMiddleware.js'
import { createProductControoler,getProductController,
         getSingleProductController,productPhotoController,
         deleteProductController,updateProductController,
         productListController,productFiltersController,
         productCountController,searchProductController,
         realtedProductController,productCategoryController,
         braintreeTokenController,brainTreePaymentController} from './../controllers/ProductController.js';

const router = express.Router();
import formidable from "express-formidable";
//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductControoler,
);
//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);
//get all products
router.get("/get-product", getProductController);

//single product
router.get("/get-product/:slug", getSingleProductController);
//get poto 
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
router.post("/product-filters", productFiltersController);

// //product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

// //search product
router.get("/search/:keyword", searchProductController);

// //similar product
router.get("/related-product/:pid/:cid", realtedProductController);

// //category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);
export default router;