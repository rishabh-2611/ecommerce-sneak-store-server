const params = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      pattern: '^[a-f\\d]{24}$',
      errorMessage: 'Should be a valid id'
    }
  }
}

const query = {
  type: 'object',
  properties: {
    skip: {
      type: 'string',
      // minimum: 0,
      errorMessage: 'skip should be a valid param'
    },
    limit: {
      type: 'string',
      // minimum: 0,
      // maximum: 100, // maximum search results is set as 100
      errorMessage: 'limit should be a valid param'
    }
  }
}

const file = {
  type: 'object',
  required: ['fieldname', 'originalname', 'encoding', 'mimetype', 'destination'],
  properties: {
    fieldname: { type: 'string' },
    originalname: { type: 'string' },
    encoding: { type: 'string' },
    mimetype: { type: 'string' },
    destination: { type: 'string' }
  },
  errorMessage: {
    required: {
      fieldname: 'File fieldname is required',
      originalname: 'File originalname is required',
      encoding: 'File encoding is required',
      mimetype: 'File mimetype is required',
      destination: 'File destination is required'
    }
  }
}

export default {
  params,
  query,
  file
}
