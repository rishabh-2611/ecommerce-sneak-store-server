/** Import App Modules */
import CartModel from "../models/cart.model.js";

async function createCart(cartObj) {
  const newCart = new CartModel(cartObj);
  return await newCart.save();
}

async function getCart(filterQuery = {}) {
  return await CartModel.findOne(filterQuery).lean().exec();
}

async function updateCart (filterQuery, updateObj) {
  return await CartModel.findOneAndUpdate(filterQuery, updateObj, { new: true }).exec()
}

export default {
  createCart,
  getCart,
  updateCart
};
