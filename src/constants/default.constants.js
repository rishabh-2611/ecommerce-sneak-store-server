/** GENERAL CONSTANTS */
export const DEFAULT_PAGINATION_LIMIT = 20

/** API RELATED CONSTANTS */
export const API = {
  CART: 'CART',
  MEDIA: 'MEDIA',
  PRODUCT: 'PRODUCT',
  REVIEW: 'REVIEW',
  SELLER: 'SELLER',
  USER: 'USER',
  WISHLIST: 'WISHLIST'
}

/** GENERIC FILTERS CONSTANTS */
export const commonFilterKeys = {
  search: {
    type: 'string',
    description: 'For searching any field',
    errorMessage: 'Search value should be a valid String'
  },
  skip: {
    type: 'string',
    errorMessage: 'Page Number should be a valid param'
  },
  limit: {
    type: 'string',
    errorMessage: 'Limit count should be a valid param'
  },
  sortBy: {
    type: 'string',
    errorMessage: 'Sort By value should be a valid string'
  },
  orderBy: {
    type: 'string',
    errorMessage: 'Order By value should be a valid string'
  },
  _: {
    type: 'string',
    datatype: 'date',
    description: 'Axios cache timestamp',
    errorMessage: 'Cache timestamp missing'
  },
  draw: {
    type: 'string',
    errorMessage: 'draw should be a valid param'
  },
  exactMatch: {
    type: 'string',
    errorMessage: 'exactMatch should be a valid param'
  },
  filterOperator: {
    type: 'string',
    errorMessage: 'filterOperator should be a valid param'
  },
  populate: {
    anyOf: [
      { type: 'string', isNotEmpty: true },
      { type: 'array' }
    ],
    errorMessage: 'populate should be a valid param'
  },
  projection: {
    anyOf: [
      { type: 'string', isNotEmpty: true },
      { type: 'array' }
    ],
    errorMessage: 'projection should be a valid param'
  }
}
