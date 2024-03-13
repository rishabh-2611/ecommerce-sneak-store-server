import { ProductCategories, ProductBrands, ProductGenders, ProductMaterials, ProductSizes } from '../constants/product.enum.js';

const createProduct = {
    type: "object",
    properties: {
      name: {
        type: "string",
        errorMessage: "Should be a valid name",
        isNotEmpty: true,
      },
      description: {
        type: "string",
        isNotEmpty: false,
      },
      details: {
        type: "object",
        properties: {
          category: { type: "string", enum: ProductCategories, errorMessage: "Should be a valid category" },
          brand: { type: "string", enum: ProductBrands, errorMessage: "Should be a valid brand"},
          gender: { type: "string", enum: ProductGenders, errorMessage: "Should be a valid gender" },
          material: { type: "string", enum: ProductMaterials, errorMessage: "Should be a valid material" },
        },
        required: ["category", "brand", "gender", "material"],
      },
      sizes: {
        type: "array",
        properties: {
          name: { type: "string", enum: ProductSizes, errorMessage: "Should have valid size"},
          quantity: { type: "string" }
        }
      },
      price: { type: "number", errorMessage: "Should be a valid number" },
      discount: { type: "number", errorMessage: "Should be a valid number" },
      originalPrice: { type: "number", errorMessage: "Should be a valid number" },
      images: {
        type: 'array',
      },
      videos: {
        type: 'array',
      },
      seller: {
        type: 'string',
        pattern: '^[a-f\\d]{24}$',
        errorMessage: 'Should be a valid user id'
      }
    },
    required: ["name", "description", "price"],
    additionalProperties: true,
  };
  
export default {
  createProduct,
};
  