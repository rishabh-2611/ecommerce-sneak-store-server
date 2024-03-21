/** Import App Modules */
import ProductModel from "../models/product.model.js";
import generalRepo from './general.repo.js'
import productSchema from '../validations/product.validation.js';

const { defaultProjectionQuery, defaultPopulateQuery } = productSchema

async function getProducts (filterQuery = {}, sortOptions = {}, skip = 0, limit = 0, projection = defaultProjectionQuery, aggregation = [], populateQuery = defaultPopulateQuery) {
  return await ProductModel.find(filterQuery, projection)
    .populate(populateQuery)
    .collation({ locale: 'en' }).sort(sortOptions).skip(skip).limit(limit).lean().exec()
}

async function getProductsWithCount (filterQuery = {}, sortOptions = {}, skip = 0, limit = 0, projection, aggregation = [],
  populateQuery) {
  const [recordsCount, filteredCount] = await generalRepo.getRecordCounts(ProductModel, filterQuery, aggregation)
  const assets = await getProducts(filterQuery, sortOptions, skip, limit, projection, aggregation, populateQuery)
  return [recordsCount, filteredCount, assets]
}

async function getProduct (filterQuery, projection = defaultProjectionQuery, populateQuery = defaultPopulateQuery) {
  return await ProductModel.findOne(filterQuery, projection).populate(populateQuery).lean().exec()
}

async function createProduct (productObj) {
  const newProduct = new ProductModel(productObj)
  await newProduct.save()
  const filterQuery = { _id: newProduct._id }
  return await getProduct(filterQuery)
}

async function updateProduct (filterQuery, updateObj) {
  return await ProductModel.findOneAndUpdate(filterQuery, updateObj, { new: true }).exec()
}

async function deleteProduct (filterQuery) {
  return await ProductModel.deleteOne(filterQuery).exec()
}

export default {
  createProduct,
  getProducts,
  getProductsWithCount,
  getProduct,
  updateProduct,
  deleteProduct
};
