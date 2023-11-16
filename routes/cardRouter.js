// Import necessary libraries
import express from 'express';
import { createCart, addToCart, checkoutCart, showCartDetails } from '../controllers/cartController.js';

const router = express.Router();

// Create a new cart for a user
router.post('/create', createCart);

// Add a product to the cart
router.post('/add',addToCart); 

// Checkout and clear the cart
router.post('/checkout', checkoutCart); 
router.post('/cartitems', showCartDetails)   

export default router;
