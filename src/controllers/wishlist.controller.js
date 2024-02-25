// import config from 'config'
import mongoose from "mongoose";
/** Import App Modules */
import wishlistRepo from "../repositories/wishlist.repo.js";
import generalUtil from "../utils/general.util.js";

const ObjectId = mongoose.Types.ObjectId;

async function getWishlist(req, res) {
  try {
    const filterQuery = {user: req.user._id};
    let wishlist = await wishlistRepo.getWishlist(filterQuery);

    if(!wishlist){
      const wishlistObj = {}
      wishlistObj.products = []
      wishlistObj.user = req.user._id
      wishlist = await wishlistRepo.createWishlist(wishlistObj);
    }

    return res.json({ data: wishlist })
  } catch (err) {
    console.error("Error - getWishlist", err.message);
  }
  res.status(500).json({ message: "Error geting wishlist" });
}

async function createWishlist(req, res) {
  try {
    const wishlistObj = req.body;
    wishlistObj.user = req.user._id
    const newWishlist = await wishlistRepo.createWishlist(wishlistObj);
    return res.json({ data: newWishlist });
  } catch (err) {
    console.error("Error - createWishlist", err.message);
  }
  res.status(500).json({ message: "Error geting wishlists" });
}

async function updateWishlist(req, res) {
  try {
    const filterQuery = {user: req.user._id};
    const wishlist = await wishlistRepo.getWishlist(filterQuery);
    if(!wishlist){
      return res.status(400).json({ message: "Wishlist does not exist" });
    }
    
    const update = req.body;
    const updatedWishlist = await wishlistRepo.updateWishlist(filterQuery, update);
    return res.json({ data: updatedWishlist });
  } catch (err) {
    console.error("Error - createWishlist", err.message);
  }
  res.status(500).json({ message: "Error geting wishlists" });
}


export default {
  createWishlist,
  getWishlist,
  updateWishlist,
};
