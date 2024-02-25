/** Import App Modules */
import ProductModel from "../models/product.model.js";
// import generalRepo from './general.repo.js'


async function getProducts(filterQuery) {
  return await ProductModel.find(filterQuery).lean().exec();
}

async function getProductsWithCount (filterQuery = {}, sortOptions = {}, skip = 0, limit = 0, projection, aggregation = [],
  populateQuery) {
  const [recordsCount, filteredCount] = await generalRepo.getRecordCounts(ProductModel, filterQuery, aggregation)
  const assets = await getProducts(filterQuery, sortOptions, skip, limit, projection, aggregation, populateQuery)
  return [recordsCount, filteredCount, assets]
}

async function getProduct(filterQuery) {
  return await ProductModel.findOne(filterQuery).lean().exec();
}

async function createProduct(productObj) {
  const newProduct = new ProductModel(productObj);
  return await newProduct.save();
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
