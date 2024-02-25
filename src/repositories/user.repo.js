/** Import App Modules */
import UserModel from '../models/user.model.js'
import userSchema from '../validations/user.validation.js'

const { defaultProjectionQuery, defaultPopulateQuery } = userSchema

async function getUser (filterQuery = {}, projection = defaultProjectionQuery, populateQuery = defaultPopulateQuery) {
  return await UserModel.findOne(filterQuery, projection)
    .populate(populateQuery)
    .lean().exec()
}

async function createUser (userObj) {
  const newUser = new UserModel(userObj)
  await newUser.save()
  return await newUser.populate()
}

async function updateUser (filterQuery, updateObj) {
  return await UserModel.findOneAndUpdate(filterQuery, updateObj, { new: true }).exec()
}

async function deleteUser (userId) {
  return await UserModel.deleteOne({ _id: userId }).exec()
}

async function isUserExists (filterQuery = {}) {
  return await UserModel.exists(filterQuery)
}

export default {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  isUserExists,
}
