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
      category: { type: "string", enum: ["sneakers","boots", "sandals", "shoes", "heels", "slippers", "flip flops", "other"], errorMessage: "Should be a valid category" },
      details: {
        type: "object",
        brand: { type: "string" },
        gender: { type: "string" },
        material: { type: "string" },
      },
      sizes: {
        type: "array",
        name: { type: "string" },
        quantity: { type: "string" }
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
    required: ["name", "category", "price", "quantity"],
    additionalProperties: true,
  };
  
export default {
  createProduct,
};
  