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


export default {
  getProducts,
  getProduct
};
