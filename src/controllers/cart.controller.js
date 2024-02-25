// import config from 'config'
import mongoose from "mongoose";
/** Import App Modules */
import cartRepo from "../repositories/cart.repo.js";
import generalUtil from "../utils/general.util.js";

const ObjectId = mongoose.Types.ObjectId;

async function getCart(req, res) {
  try {
    const filterQuery = {user: req.user._id};
    let cart = await cartRepo.getCart(filterQuery);

    if(!cart){
      const cartObj = {}
      cartObj.items = []
      cartObj.user = req.user._id
      cart = await cartRepo.createCart(cartObj);
    }

    return res.json({ data: cart })
  } catch (err) {
    console.error("Error - getCart", err.message);
  }
  res.status(500).json({ message: "Error geting cart" });
}

async function createCart(req, res) {
  try {
    const cartObj = req.body;
    cartObj.user = req.user._id
    const newCart = await cartRepo.createCart(cartObj);
    return res.json({ data: newCart });
  } catch (err) {
    console.error("Error - createCart", err.message);
  }
  res.status(500).json({ message: "Error geting carts" });
}

async function updateCart(req, res) {
  try {
    const filterQuery = {user: req.user._id};
    const cart = await cartRepo.getCart(filterQuery);
    if(!cart){
      return res.status(400).json({ message: "Cart does not exist" });
    }
    
    const update = req.body;
    const updatedCart = await cartRepo.updateCart(filterQuery, update);
    return res.json({ data: updatedCart });
  } catch (err) {
    console.error("Error - createCart", err.message);
  }
  res.status(500).json({ message: "Error geting carts" });
}


export default {
  createCart,
  getCart,
  updateCart,
};
