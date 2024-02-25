// import config from 'config'
import mongoose from "mongoose";
/** Import App Modules */
import mediaRepo from "../repositories/media.repo.js";
import generalUtil from "../utils/general.util.js";

const ObjectId = mongoose.Types.ObjectId;

async function getMedias (req, res) {
  try {
    const [recordsCount, filteredCount, mediaDetails] = await mediaRepo.getMedias(
      req.customQuery, req.sort, req.skip, req.limit, req.projectionQuery, req.aggregation, req.populateQuery
    )
    const responseData = { data: mediaDetails, recordsFiltered: filteredCount, recordsTotal: recordsCount }
    if (req.draw) { responseData.draw = req.draw }
    return res.json(responseData)
  } catch (err) {
    console.error('Error - getMedias', err.message)
  }
  res.status(500).json({ message: 'Error getting medias' })
}

async function getMedia(req, res) {
  try {
    const filterQuery = {user: req.user._id};
    const media = await mediaRepo.getMedia(filterQuery);

    if(!media){
      return res.status(400).json({ message: "Media does not exist" });
    }

    return res.json({ data: media })
  } catch (err) {
    console.error("Error - getMedia", err.message);
  }
  res.status(500).json({ message: "Error geting media" });
}

async function createMedia(req, res) {
  try {
    const mediaObj = req.body;
    mediaObj.uploadedBy = req.user._id
    const newMedia = await mediaRepo.createMedia(mediaObj);
    return res.json({ data: newMedia });
  } catch (err) {
    console.error("Error - createMedia", err.message);
  }
  res.status(500).json({ message: "Error geting medias" });
}

async function updateMedia(req, res) {
  try {
    const filterQuery = {_id: req.params.id, uploadedBy: req.user._id};
    const media = await mediaRepo.getMedia(filterQuery);
    if(!media){
      return res.status(400).json({ message: "Media does not exist" });
    }
    
    const update = req.body;
    const updatedMedia = await mediaRepo.updateMedia(filterQuery, update);
    return res.json({ data: updatedMedia });
  } catch (err) {
    console.error("Error - updateMedia", err.message);
  }
  res.status(500).json({ message: "Error geting media" });
}

async function deleteMedia(req, res) {
  try {
    const filterQuery = {_id: req.params.id, uploadedBy: req.user._id};
    const media = await mediaRepo.getMedia(filterQuery);

    if(!media){
      return res.status(400).json({ message: "Media does not exist" });
    }

    const result = await mediaRepo.deleteMedia(filterQuery)
    if (!result.acknowledged) return res.status(500).json({ message: 'Error deleting item' })
    if (!result.deletedCount) return res.status(404).json({ message: 'Error deleting item' })
    return res.json({ message: 'Media deleted successfully' })
  } catch (err) {
    console.error("Error - deleteMedia", err.message);
  }
  res.status(500).json({ message: "Error deleting media" });
}


export default {
  createMedia,
  getMedias,
  getMedia,
  updateMedia,
  deleteMedia
};
