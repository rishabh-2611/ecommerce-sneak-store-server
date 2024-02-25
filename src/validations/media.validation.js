const createMedia = {
    type: "object",
    properties: {
      name: {
        type: "string",
        errorMessage: "Should be a valid name",
        isNotEmpty: true,
      },
      file: {
        type: "string",
      },
      url: {
        type: "string",
      },
      fileType: { type: "string", enum: ['image', 'video'], errorMessage: "Should be a valid type" },
      type: { type: "string", enum: ['user', 'product'], errorMessage: "Should be a valid category" },
      uploadedBy: {
        type: 'string',
        pattern: '^[a-f\\d]{24}$',
        errorMessage: 'Should be a valid user id'
      }
    },
    required: ["name", "file", "url", "fileType", 'type'],
    additionalProperties: true,
  };
  
export default {
  createMedia,
};
  