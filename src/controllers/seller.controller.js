// import config from 'config'
import mongoose from "mongoose";
/** Import App Modules */
import productRepo from "../repositories/product.repo.js";
import generalUtil from "../utils/general.util.js";

const ObjectId = mongoose.Types.ObjectId;

async function getProducts (req, res) {
  try {
    const [recordsCount, filteredCount, productDetails] = await productRepo.getProductsWithCount(
      req.customQuery, req.sort, req.skip, req.limit, req.projectionQuery, req.aggregation, req.populateQuery
    )
    const responseData = { data: productDetails, recordsFiltered: filteredCount, recordsTotal: recordsCount }
    if (req.draw) { responseData.draw = req.draw }
    return res.json(responseData)
  } catch (err) {
    console.error('Error - getProducts', err.message)
  }
  res.status(500).json({ message: 'Error getting products' })
}

async function getProduct(req, res) {
  try {
    const filterQuery = {_id: req.params.id};
    const product = await productRepo.getProduct(filterQuery);

    if(!product){
      return res.status(400).json({ message: "Product does not exist" });
    }

    return res.json({ data: product })
  } catch (err) {
    console.error("Error - getProduct", err.message);
  }
  res.status(500).json({ message: "Error geting product" });
}

async function createProduct(req, res) {
  try {
    const productObj = req.body;
    productObj.seller = req.user._id
    const newProduct = await productRepo.createProduct(productObj);
    return res.json({ message: 'Product added successfully', data: newProduct });
  } catch (err) {
    console.error("Error - createProduct", err.message);
  }
  res.status(500).json({ message: "Error geting products" });
}

async function updateProduct(req, res) {
  try {
    const filterQuery = {_id: req.params.id};
    const product = await productRepo.getProduct(filterQuery);
    if(!product){
      return res.status(400).json({ message: "Product does not exist" });
    }
    
    const update = req.body;
    const updatedProduct = await productRepo.updateProduct(filterQuery, update);
    return res.json({ data: updatedProduct });
  } catch (err) {
    console.error("Error - updateProduct", err.message);
  }
  res.status(500).json({ message: "Error geting products" });
}

async function deleteProduct(req, res) {
  try {
    const filterQuery = {_id: req.params.id};
    const product = await productRepo.getProduct(filterQuery);

    if(!product){
      return res.status(400).json({ message: "Product does not exist" });
    }

    const result = await productRepo.deleteProduct(filterQuery)
    if (!result.acknowledged) return res.status(500).json({ message: 'Error deleting item' })
    if (!result.deletedCount) return res.status(404).json({ message: 'Error deleting item' })
    return res.json({ message: 'Product deleted successfully' })
  } catch (err) {
    console.error("Error - deleteProduct", err.message);
  }
  res.status(500).json({ message: "Error deleting product" });
}


export default {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};
