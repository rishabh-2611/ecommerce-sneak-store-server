/** Import App Modules */
import WishlistModel from "../models/wishlist.model.js";

async function createWishlist(wishlistObj) {
  const newWishlist = new WishlistModel(wishlistObj);
  return await newWishlist.save();
}

async function getWishlist(filterQuery = {}) {
  return await WishlistModel.findOne(filterQuery).lean().exec();
}

async function updateWishlist (filterQuery, updateObj) {
  return await WishlistModel.findOneAndUpdate(filterQuery, updateObj, { new: true }).exec()
}

export default {
  createWishlist,
  getWishlist,
  updateWishlist
};
