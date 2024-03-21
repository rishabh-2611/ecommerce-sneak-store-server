import { ProductCategories, ProductBrands, ProductGenders, ProductMaterials, ProductSizes } from '../constants/enums/product.enum.js';

const getProducts = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      errorMessage: 'Name needs to be a valid value'
    },
    category: { type: "string", schemaKey: 'details.category', enum: ProductCategories, errorMessage: "Should be a valid category" },
    brand: { type: "string", schemaKey: 'details.brand', enum: ProductBrands, errorMessage: "Should be a valid brand"},
    gender: { type: "string", schemaKey: 'details.gender', enum: ProductGenders, errorMessage: "Should be a valid gender" },
    material: { type: "string", schemaKey: 'details.material', enum: ProductMaterials, errorMessage: "Should be a valid material" },
    sizes: {
      type: "array",
      properties: {
        name: { type: "string", enum: ProductSizes, errorMessage: "Should have valid size"},
        quantity: { type: "string" }
      }
    },
    price: { type: "string", errorMessage: "Should be a valid number" },
    discount: { type: "string", errorMessage: "Should be a valid number" },
  },
  entity: 'product',
  search: {
    fields: [
      { sortField: 'name', schemaKey: 'name', type: 'string' },
      { sortField: 'category', schemaKey: 'details.category', type: 'string' },
      { sortField: 'brand', schemaKey: 'details.brand', type: 'string' },
      { sortField: 'gender', schemaKey: 'details.gender', type: 'string' },
      { sortField: 'material', schemaKey: 'details.material', type: 'string' },
      { sortField: 'price', schemaKey: 'price', type: 'string' },
      { sortField: 'discount', schemaKey: 'discount', type: 'string' }
    ]
  },
}

const defaultProjectionQuery = {
  name: 1,
  description: 1,
  details: 1,
  originalPrice: 1,
  discount: 1,
  price: 1,
  images: 1,
  rating: 1,
  totalRatings: 1,
  seller: 1
}

const defaultPopulateQuery = [
  {
    path: 'images',
    select: 'url'
  },
  {
    path: 'seller',
    select: 'details'
  }
]
  
export default {
  getProducts,
  defaultProjectionQuery,
  defaultPopulateQuery
};
  