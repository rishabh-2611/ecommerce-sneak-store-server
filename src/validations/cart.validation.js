const createCart = {
    type: "object",
    properties: {
      items: {
        type: "array",
        product: {
          type: 'string',
          pattern: '^[a-f\\d]{24}$',
          errorMessage: 'Should be a valid user id'
        },
        size: { type: "number", errorMessage: "Should be a valid number" },
        quantity: { type: "number", errorMessage: "Should be a valid number" },
      },
      user: {
        type: 'string',
        pattern: '^[a-f\\d]{24}$',
        errorMessage: 'Should be a valid user id'
      }
    },
    additionalProperties: true,
  };
  
export default {
  createCart,
};
  