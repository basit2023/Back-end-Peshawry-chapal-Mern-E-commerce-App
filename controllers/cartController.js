// Import necessary libraries
import Cart from '../models/cartModel.js';

// Create a new card
export const createCart = async (req, res) => {
  try {
    const cart = new Cart();
    await cart.save();
    return res.status(201).json({ success: true, message: 'Cart created successfully', cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({success: false, message: 'Error creating cart', error });
  }
};

// Add a product to cart
export const addToCart = async (req, res) => {
  try {
    const { quantity } = req.body;
    const userId = req.body.user; 
    const productId=req.body.product;
    console.log(productId)
   
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = new Cart({ user: userId });
      console.log("the cart is:", cart)
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return res.status(200).json({ success: true, message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error adding to cart', error });
  }
};

export const checkoutCart = async (req, res) => {
  try {
    const userId = req.user._id; 
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = []; 
    await cart.save();

    return res.status(200).json({ success: true, message: 'Cart checked out successfully', cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error checking out cart', error });
  }
};

export const showCartDetails = async (req, res) => {

  // const pageSize = 10;
  // const pageNumber = 2;
  // const skip = (pageNumber - 1) * pageSize;
  try {
    
   


    const { quantity } = req.body;
    const userId = req.body.user; 
    const productId=req.body.product;
    console.log("the body is", productId, userId);
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: 'items.product',
        model: 'Products',
        select: '-_id -createdAt -updatedAt -__v',
      })
      // .populate("users");
      // .skip(skip).limit(pageSize);

    if (!cart) {
      return res.status(200).send({ success: true, message: "The cart is empty" });
    }
    res.status(200).send({ success: true, message: "Card details", cart });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};
