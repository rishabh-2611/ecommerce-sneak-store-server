/** Import App Modules */
import ReviewModel from "../models/review.model.js";

async function getReviews(filterQuery) {
  return await ReviewModel.find(filterQuery).lean().exec();
}

async function getReview(filterQuery) {
  return await ReviewModel.findOne(filterQuery).lean().exec();
}

async function createReview(reviewObj) {
  const newReview = new ReviewModel(reviewObj);
  return await newReview.save();
}

async function updateReview (filterQuery, updateObj) {
  return await ReviewModel.findOneAndUpdate(filterQuery, updateObj, { new: true }).exec()
}

async function deleteReview (filterQuery) {
  return await ReviewModel.deleteOne(filterQuery).exec()
}

export default {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview
};
