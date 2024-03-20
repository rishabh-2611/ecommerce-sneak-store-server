const userProperties = {
  email: {
    type: 'string',
    format: 'email',
    description: 'User email address',
    errorMessage: 'Should be a valid email'
  },
  credentials: {
    type: 'object',
    properties: {
      salt: { type: 'string' },
      password: { type: 'string' }
    }
  },
  details: {
    type: 'object',
    properties: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
    },
    additionalProperties: false
  },
  type: { type: "string", enum: ["Admin", "Buyer", "Seller"], errorMessage: "Should be a valid type" }
}


const createUser = {
  type: 'object',
  properties: userProperties,
  required: ['email', 'details.firstName', 'details.lastName'],
  $defs: { ObjectId: { type: 'string', pattern: '^[a-f\\d]{24}$' } }
}

const updateUser = {
  type: 'object',
  properties: userProperties,
  $defs: { ObjectId: { type: 'string', pattern: '^[a-f\\d]{24}$' } }
}

const getUsers = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      description: 'User\'s Email address',
      errorMessage: 'Email value should be a valid String'
    },
    name: {
      type: 'string',
      description: 'User\'s Name (FirstName/LastName)',
      errorMessage: 'Name value should be a valid String'
    },
    isEnabled: {
      type: 'string',
      description: 'User Account Status',
      errorMessage: 'IsEnabled value should be either true/false'
    },
    lastActivity: {
      type: 'string',
      datatype: 'date',
      description: 'Timestamp at which Last Activity was recorded of the User',
      errorMessage: 'Last Activity should be a valid string'
    }
  },
  entity: 'user',
  search: {
    fields: [
      { sortField: 'name', schemaKey: 'details.firstName', type: 'string' },
      { sortField: 'name', schemaKey: 'details.lastName', type: 'string' },
      { sortField: 'email', schemaKey: 'email', type: 'string' },
      { sortField: 'lastActivity', schemaKey: 'lastActivity', type: 'date' }
    ]
  },
  additionalProperties: { not: true, errorMessage: 'One or more Query fields are invalid!' }
}

const defaultProjectionQuery = {
  email: 1,
  isEnabled: 1,
  lastActivity: 1,
  credentials: 1,
  type: 1,
  details: 1,
  resetPasswordToken: 1,
  resetPasswordTokenExpiry: 1,
  createdAt: 1,
  updatedAt: 1,
}

const defaultPopulateQuery = [
  {
    path: 'image'
  }
]

const defaultPopulateKeyList = defaultPopulateQuery.map(value => value.path)

export default {
  createUser,
  updateUser,
  getUsers,
  defaultProjectionQuery,
  defaultPopulateQuery,
  defaultPopulateKeyList
}
