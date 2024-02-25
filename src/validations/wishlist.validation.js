const createWishlist = {
    type: "object",
    properties: {
      products: [
        {
          type: 'string',
          pattern: '^[a-f\\d]{24}$',
          errorMessage: 'Should be a valid product id'
        }
      ],
      user: {
        type: 'string',
        pattern: '^[a-f\\d]{24}$',
        errorMessage: 'Should be a valid user id'
      }
    },
    additionalProperties: true,
  };
  
export default {
  createWishlist,
};
  