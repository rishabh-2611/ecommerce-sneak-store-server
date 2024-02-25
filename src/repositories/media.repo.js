/** Import App Modules */
import MediaModel from "../models/media.model.js";

async function getMedias(filterQuery) {
  return await MediaModel.find(filterQuery).lean().exec();
}

async function getMedia(filterQuery) {
  return await MediaModel.findOne(filterQuery).lean().exec();
}

async function createMedia(mediaObj) {
  const newMedia = new MediaModel(mediaObj);
  return await newMedia.save();
}

async function updateMedia (filterQuery, updateObj) {
  return await MediaModel.findOneAndUpdate(filterQuery, updateObj, { new: true }).exec()
}

async function deleteMedia (filterQuery) {
  return await MediaModel.deleteOne(filterQuery).exec()
}

export default {
  createMedia,
  getMedias,
  getMedia,
  updateMedia,
  deleteMedia
};
