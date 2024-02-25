const createReview = {
    type: "object",
    properties: {
      title: {
        type: "string",
        errorMessage: "Should be a valid title",
      },
      description: {
        type: "string",
        isNotEmpty: false,
      },
      product: {
        type: 'string',
        pattern: '^[a-f\\d]{24}$',
        errorMessage: 'Should be a valid product id'
      },
      buyer: {
        type: 'string',
        pattern: '^[a-f\\d]{24}$',
        errorMessage: 'Should be a valid user id'
      },
      rating: { type: "number", errorMessage: "Should be a valid number" },
      images: {
        type: 'array',
      },
      videos: {
        type: 'array',
      },
    },
    required: ["title"],
    additionalProperties: true,
  };
  
export default {
  createReview,
};
  