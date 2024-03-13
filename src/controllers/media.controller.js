// import config from 'config'
import mongoose from "mongoose";
import fs from "fs";
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

async function uploadFiles (req, res) {
  try {
    if (!req.files || !req.body.category) return res.status(400).send({ message: 'Bad request' })
    const { category } = req.body

    const allPromises = []
    for(let i = 0; i < req.files.length; i++) {
      const file = req.files[i]

      const extension = file.mimetype.split('/')[1]
      const name = new Date().getTime() + '.' + extension
      const url = file.destination + name
      const fileType = file.mimetype.split('/')[0]
      // If uploaded file is not image or video then discard the file
      if (!['image','video'].includes(fileType)) continue
      
      // Rename files
      fs.renameSync(file.path, url)

      const imageDoc = {
        name,
        category,
        fileType,
        url,
        uploadedBy: req.user._id,
      }

      allPromises.push(mediaRepo.createMedia(imageDoc))
    }

    const promisesResult = await Promise.all(allPromises)
    return res.json({ message: 'Media uploaded successfully', data: promisesResult })
  } catch (err) {
    console.error('Error - uploadFile', err.message)
  }

  res.status(500).json({ message: 'Error uploading file' })
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
  deleteMedia,
  uploadFiles
};
