// import config from 'config'
import mongoose from "mongoose";
/** Import App Modules */
import reviewRepo from "../repositories/review.repo.js";
import generalUtil from "../utils/general.util.js";

const ObjectId = mongoose.Types.ObjectId;

async function getReviews (req, res) {
  try {
    const [recordsCount, filteredCount, reviewDetails] = await mediaRepo.getReviews(
      req.customQuery, req.sort, req.skip, req.limit, req.projectionQuery, req.aggregation, req.populateQuery
    )
    const responseData = { data: reviewDetails, recordsFiltered: filteredCount, recordsTotal: recordsCount }
    if (req.draw) { responseData.draw = req.draw }
    return res.json(responseData)
  } catch (err) {
    console.error('Error - getReviews', err.message)
  }
  res.status(500).json({ message: 'Error getting reviews' })
}

async function getReview(req, res) {
  try {
    const filterQuery = {user: req.user._id};
    let review = await reviewRepo.getReview(filterQuery);

    if(!review){
      return res.status(400).json({ message: "Review does not exist" });
    }

    return res.json({ data: review })
  } catch (err) {
    console.error("Error - getReview", err.message);
  }
  res.status(500).json({ message: "Error geting review" });
}

async function createReview(req, res) {
  try {
    const reviewObj = req.body;
    reviewObj.buyer = req.user._id
    const newReview = await reviewRepo.createReview(reviewObj);
    return res.json({ data: newReview });
  } catch (err) {
    console.error("Error - createReview", err.message);
  }
  res.status(500).json({ message: "Error geting reviews" });
}

async function updateReview(req, res) {
  try {
    const filterQuery = {_id: req.params.id, buyer: req.user._id};
    const review = await reviewRepo.getReview(filterQuery);
    if(!review){
      return res.status(400).json({ message: "Review does not exist" });
    }
    
    const update = req.body;
    const updatedReview = await reviewRepo.updateReview(filterQuery, update);
    return res.json({ data: updatedReview });
  } catch (err) {
    console.error("Error - updateReview", err.message);
  }
  res.status(500).json({ message: "Error geting review" });
}

async function deleteReview(req, res) {
  try {
    const filterQuery = {_id: req.params.id, buyer: req.user._id};
    const review = await reviewRepo.getReview(filterQuery);

    if(!review){
      return res.status(400).json({ message: "Review does not exist" });
    }

    const result = await reviewRepo.deleteReview(filterQuery)
    if (!result.acknowledged) return res.status(500).json({ message: 'Error deleting item' })
    if (!result.deletedCount) return res.status(404).json({ message: 'Error deleting item' })
    return res.json({ message: 'Review deleted successfully' })
  } catch (err) {
    console.error("Error - deleteReview", err.message);
  }
  res.status(500).json({ message: "Error deleting review" });
}


export default {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview
};
