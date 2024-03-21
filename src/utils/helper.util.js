import mongoose from 'mongoose'
/** Import App Modules */
import { DEFAULT_PAGINATION_LIMIT } from '../constants/default.constants.js'

const queryBuilder = (schema, defaultPopulateKeyList) => {
  return (req, res, next) => {
    try {
      const { draw, exactMatch, orOperator, skip, limit, search, sortField, sortType, filterQueries, populate, projection } = extractQueryParams(req.query)
      const query = req.filterQuery || {}
      let andQuery = []
    //   if (!orOperator && req.filterQuery.$and) andQuery = andQuery.concat(req.filterQuery.$and)

      let aggregationObj = {
        aggregation: [],
        unset: [],
        addFields: [],
        sortKey: ''
      }

      /** Sorting logic */
      const sortQueryResult = prepareSortQuery(schema, sortField, sortType, aggregationObj)
      aggregationObj.sortKey = sortQueryResult.sortKey
      const sort = sortQueryResult.sort

      /** Filter logic */
      const filterQueryResult = prepareFilterQuery(schema, filterQueries, exactMatch, sortQueryResult.aggregationObj, andQuery)

      /** Search logic */
      const searchQueryResult = prepareSearchQuery(schema, search, filterQueryResult.aggregationObj, filterQueryResult.andQuery)

      /** Population logic */
      const populateQueryResult = preparePopulateQuery(populate, defaultPopulateKeyList)

      /** Projection logic */
      const projectionQueryResult = prepareProjectionQuery(projection, populateQueryResult)

      /** Final Result */
      aggregationObj = searchQueryResult.aggregationObj
      andQuery = searchQueryResult.andQuery

      // Only set $and query when there is an andQuery. otherwise, no need!
      if (andQuery.length) {
        if (orOperator) {
          if (query.$and && query.$and.length) query.$and = query.$and.push({ $or: andQuery })
          else query.$or = andQuery
        } else query.$and = andQuery
      }

      console.log('Filter Middleware ', { query, skip, limit, sort, aggregationObj })
      console.log('Filter Middleware Detailed', query.$and, aggregationObj.aggregation)

      /** Final Aggregation Query */
      const aggregationQueries = prepareAggregateQuery(aggregationObj, query, sort, skip, limit)

      // Setting the query, skip & limit in req object
      if (draw !== undefined) { req.draw = draw }
      req.customQuery = query
      req.skip = skip
      req.limit = limit
      req.sort = sort
      req.aggregation = aggregationQueries
      req.populateQuery = projectionQueryResult.populateQuery
      req.projectionQuery = projectionQueryResult.projectionQuery

      next()
    } catch (error) {
      console.log('queryBuilder() catch error', error)
      if (error.errorMessage) {
        return res.status(error.errorCode).send({ message: error.errorMessage })
      }
      res.status(500).send({ message: 'Error processing query.' })
    }
  }
}


const extractQueryParams = (queryParams) => {
  // handle temporarily
  if (queryParams._ !== undefined) {
    delete queryParams._
  }
  // handle draw
  const draw = parseInt(queryParams.draw) || undefined
  delete queryParams.draw
  // check if exact match is required
  let exactMatch = false
  if (queryParams.exactMatch !== undefined) {
    exactMatch = queryParams.exactMatch === 'true'
    delete queryParams.exactMatch
  }
  let orOperator = false
  if (queryParams.filterOperator !== undefined) {
    orOperator = queryParams.filterOperator === 'or'
    delete queryParams.filterOperator
  }
  // Extract skip and limit
  const skip = parseInt(queryParams.skip) || 0
  const limit = parseInt(queryParams.limit) || DEFAULT_PAGINATION_LIMIT
  delete queryParams.skip
  delete queryParams.limit
  // Extract search value and escape all special characters
  const search = queryParams.search && queryParams.search.length ? queryParams.search.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&') : undefined
  delete queryParams.search
  // Extract sort and order
  const sortField = queryParams.sortBy
  const sortType = queryParams.orderBy
  delete queryParams.sortBy
  delete queryParams.orderBy
  // Extract populate
  const populate = queryParams.populate
  delete queryParams.populate
  // Extract projection
  const projection = queryParams.projection
  delete queryParams.projection
  // Extract filters
  const filterQueries = queryParams
  return { draw, exactMatch, orOperator, skip, limit, search, sortField, sortType, filterQueries, populate, projection }
}

const prepareSortQuery = (schema, sortField, sortType, aggregationObj) => {
  const sort = {}
  let sortKey = 'primary'
  if (sortField && sortField) {
    const finalSortType = sortType === 'asc' ? 1 : sortType === 'desc' ? -1 : 1

    if (schema.search.fields && schema.search.fields.length) {
      const sortFieldAggregationObjects = schema.search.fields.filter(o => o.sortField === sortField)
      for (const sortFieldAggregationObject of sortFieldAggregationObjects) {
        const sortSchemaKey = sortFieldAggregationObject.schemaKey
        if (sortSchemaKey !== undefined) {
          if (sortFieldAggregationObject.type === 'ObjectId') {
            sortKey = 'secondary'
          }
          sort[sortSchemaKey] = finalSortType
          if (sortFieldAggregationObject.lookups && sortFieldAggregationObject.lookups.length) {
            const lookups = sortFieldAggregationObject.lookups
            for (let i = 0; i < lookups.length; i++) {
              const lookup = lookups[i]
              aggregationObj = addToAggregation(lookup.collectionName, lookup.localField, lookup.foreignField, lookup.as, aggregationObj)
            }
          }
          if (sortFieldAggregationObject.addFields && sortFieldAggregationObject.addFields.length) {
            const addFields = sortFieldAggregationObject.addFields
            for (let i = 0; i < addFields.length; i++) {
              aggregationObj = addFieldsToAggregation(addFields[i], aggregationObj)
            }
          }
        } else {
          console.log('queryBuilder unknown sort field')
        }
      }
    }
  }
  // default sorting field
  if (Object.keys(sort).length === 0) {
    sort._id = -1
  }
  return { sort, sortKey, aggregationObj }
}

const prepareFilterQuery = (schema, filterQueries, exactMatch, aggregationObj, andQuery) => {
  const queryKeys = Object.keys(filterQueries)
  for (let i = 0; i < queryKeys.length; i++) {
    const key = queryKeys[i]
    const datatype = schema.properties[key] && schema.properties[key].datatype
      ? schema.properties[key].datatype
      : schema.properties[key] && schema.properties[key].type
        ? schema.properties[key].type
        : undefined
    const entity = schema.entity
    const schemaKey = schema.properties[key] && schema.properties[key].schemaKey !== undefined ? schema.properties[key].schemaKey : key

    // Check if aggregation is required
    if (schema.properties[key] && schema.properties[key].aggregation !== undefined) {
      const from = schema.properties[key].aggregation.collectionName
      const localField = schema.properties[key].aggregation.localField
      const foreignField = schema.properties[key].aggregation.foreignField
      const as = schema.properties[key].aggregation.as
      aggregationObj = addToAggregation(from, localField, foreignField, as, aggregationObj)
    }

    if (datatype !== 'date') {
      const queryValuesArray = filterQueries[key].split(',')

      if (queryValuesArray && queryValuesArray.length) {
        const queryArray = []

        for (let k = 0; k < queryValuesArray.length; k++) {
          // Escape all special characters except space
          const queryValue = queryValuesArray[k].replace(/[-[\]{}()*+?.,\\/^$|#]/g, '\\$&')

          const subQuery = {}
          // Field datatype is string
          if (datatype === 'string') {
            // If the field is name and the entity is user, consider the value for firstname & lastname
            if (key === 'name' && entity === 'user') {
              if (!exactMatch) subQuery.$or = [{ 'details.firstName': { $regex: queryValue, $options: 'i' } }, { 'details.lastName': { $regex: queryValue, $options: 'i' } }]
              else subQuery.$or = [{ 'details.firstName': queryValue }, { 'details.lastName': queryValue }]
            } else if (key === 'createdBy') {
              if (!exactMatch) subQuery.$or = [{ 'newUser.details.firstName': { $regex: queryValue, $options: 'i' } }, { 'newUser.details.lastName': { $regex: queryValue, $options: 'i' } }]
              else subQuery.$or = [{ 'newUser.details.firstName': queryValue }, { 'newUser.details.lastName': queryValue }]
            } else {
              // Check if the value is boolean
              const booleanValue = queryValue === 'true' ? true : queryValue === 'false' ? false : undefined

              if (booleanValue !== undefined) {
                subQuery[schemaKey] = booleanValue
              } else {
                if (!exactMatch) subQuery[schemaKey] = { $regex: queryValue, $options: 'i' }
                else subQuery[schemaKey] = queryValue
              }
            }

            // Field datatype number/integer - !Thorough testing to be done!
          } else if (datatype === 'integer' || datatype === 'number') {
            const numericValue = parseFloat(queryValue)

            if (!isNaN(numericValue)) {
              if (!exactMatch) subQuery.$expr = { $regexMatch: { input: { $toString: `$${schemaKey}` }, regex: queryValue } }
              else subQuery[schemaKey] = numericValue
            } else {
              const errorMessage = { errorCode: 400, errorMessage: `${schemaKey} needs to be a number` }
              throw errorMessage
            }

            // Unsupported datatype
          } else if (datatype === 'ObjectId|Array') {
            subQuery[schemaKey] = { $in: [mongoose.Types.ObjectId(queryValue)] }
          } else if (datatype === 'ObjectId') {
            subQuery[schemaKey] = mongoose.Types.ObjectId(queryValue)
          } else if (datatype === 'boolean') {
            const booleanValue = queryValue === 'true' ? true : queryValue === 'false' ? false : undefined
            subQuery[schemaKey] = booleanValue
          } else {
            console.log('queryBuilder() unkown datatype')
          }

          if (Object.keys(subQuery).length) {
            queryArray.push(subQuery)
          }
        }

        if (queryArray.length > 1) {
          andQuery.push({ $or: queryArray })
        } else {
          if (queryArray.length) {
            andQuery.push(queryArray[0])
          }
        }
      }
      // Field datatype date
    } else {
      const dateObj = JSON.parse(filterQueries[key])

      if (dateObj !== undefined) {
        const { startDate, endDate } = dateObj

        const dateQueryObj = {}
        dateQueryObj[schemaKey] = {}

        if (startDate !== undefined && !isNaN(startDate)) {
          const isoStartDate = new Date(parseInt(startDate))
          dateQueryObj[schemaKey].$gte = isoStartDate
        }

        if (endDate !== undefined && !isNaN(endDate)) {
          const isoEndDate = new Date(parseInt(endDate))
          dateQueryObj[schemaKey].$lte = isoEndDate
        }

        if (Object.keys(dateQueryObj[schemaKey]).length) {
          andQuery.push(dateQueryObj)
        }
      }
    }
  }
  return { aggregationObj, andQuery }
}

const prepareSearchQuery = (schema, search, aggregationObj, andQuery) => {
  if (search) {
    let searchQuery
    // Check if the schema has search object
    if (schema && schema.search) {
      // Check for the fields array
      if (schema.search.fields && schema.search.fields.length) {
        const searchFields = schema.search.fields
        const orArray = []

        for (let i = 0; i < searchFields.length; i++) {
          const searchFieldObj = searchFields[i]
          const schemaKey = searchFieldObj.schemaKey
          const datatype = searchFieldObj.type

          const obj = {}

          // create search objects for different datatypes
          if (datatype === 'string' || datatype === 'array|string') {
            obj[schemaKey] = { $regex: search, $options: 'i' }
          } else if (datatype === 'array|number') {
            const numericValue = parseFloat(search)
            if (!isNaN(numericValue)) {
              for (let i = 0; i < searchFieldObj.addFields.length; i++) {
                obj.$expr = { $eq: [searchFieldObj.addFields[i].value, numericValue] }
              }
            }
          } else if (datatype === 'number' || datatype === 'integer') {
            const numericValue = parseFloat(search)

            if (!isNaN(numericValue)) {
              obj.$expr = { $regexMatch: { input: { $toString: `$${schemaKey}` }, regex: search } }
            }
          } else if (datatype === 'date') {
            obj.$expr = { $regexMatch: { input: { $toString: `$${schemaKey}` }, regex: search } }
          } else if (datatype === 'array|object') {
            const array = searchFieldObj.array

            if (array) {
              const arraySearchObj = {}
              arraySearchObj[schemaKey] = { $regex: search, $options: 'i' }

              if (searchFieldObj.extraCondition && Object.keys(searchFieldObj.extraCondition).length > 0) {
                Object.assign(arraySearchObj, searchFieldObj.extraCondition)
              }
              obj[array] = { $elemMatch: arraySearchObj }
            }
          } else if (datatype === 'ObjectId') {
            obj[schemaKey] = { $regex: search, $options: 'i' }

            // for fields with datatype as ObjectId we need to perform aggregation
            const lookups = searchFieldObj.lookups
            for (let j = 0; j < lookups.length; j++) {
              const lookup = lookups[j]
              aggregationObj = addToAggregation(lookup.collectionName, lookup.localField, lookup.foreignField, lookup.as, aggregationObj)
            }
          }

          if (Object.keys(obj).length > 0) {
            orArray.push(obj)
          }
        }

        if (orArray.length > 0) {
          // console.log('search', JSON.stringify(orArray))
          searchQuery = { $or: orArray }
        }
      }
    } else {
      searchQuery = { $text: { $search: search } }
    }

    if (searchQuery && Object.keys(searchQuery).length > 0) {
      andQuery.push(searchQuery)
    }
  }
  return { aggregationObj, andQuery }
}

const preparePopulateQuery = (populate, defaultPopulateKeyList = []) => {
  let populateQuery
  if (populate) {
    const populateType = typeof (populate)
    if (populateType === 'object') {
      for (const index in populate) {
        let populateObj = populate[index]
        if (typeof (populateObj) === 'string') {
          // For populate query where an array of string is given by the user, we will transform it into the path,select form
          populateObj = { path: populateObj }
          populate[index] = populateObj
        }
        if (!populateObj || !populateObj.path || populateObj.path === '') {
          const errorMessage = { errorCode: 400, errorMessage: 'path is required in the populate query' }
          throw errorMessage
        }
        if (!defaultPopulateKeyList.includes(populateObj.path)) {
          const errorMessage = { errorCode: 400, errorMessage: `specified path '${populateObj.path}' is invalid in the populate query` }
          throw errorMessage
        }
      }
      populateQuery = populate
    } else if (populateType === 'string' && populate === 'false') {
      populateQuery = []
    } else {
      // Handle invalid populate value and make it empty
      populateQuery = []
    }
  }
  return populateQuery
}

const prepareProjectionQuery = (projection, populateQuery) => {
  let projectionQuery
  if (projection) {
    const projectionType = typeof (projection)
    if (projectionType === 'object') { // Its an array
      const projections = [...new Set(projection)]
      projectionQuery = projections.reduce((accumulator, currentValue) => { return { ...accumulator, [currentValue]: 1 } }, {})
    } else if (projectionType === 'string') {
      if (projection === 'false') {
        projectionQuery = {}
      } else {
        const projections = [...new Set(projection.split(','))]
        projectionQuery = projections.reduce((accumulator, currentValue) => { return { ...accumulator, [currentValue]: 1 } }, {})
      }
    } else {
      // Handle invalid projection value and make it empty
      projectionQuery = {}
    }
  }
  return { populateQuery, projectionQuery }
}

const addToAggregation = (from, localField, foreignField, as, aggregationObj) => {
  const lookupObj = { $lookup: { from, localField, foreignField, as } }
  // const unwindObj = { $unwind: { path: `$${as}`, preserveNullAndEmptyArrays: true } }

  // Check if the lookup/unwind obj with same config already exists in the aggregation array
  if (!aggregationObj.aggregation.some(obj => (obj && obj.$lookup && obj.$lookup.from === lookupObj.$lookup.from) && (obj && obj.$lookup && obj.$lookup.as === lookupObj.$lookup.as))) {
    aggregationObj.aggregation.push(lookupObj)
    // aggregationObj.aggregation.push(unwindObj)
    aggregationObj.unset.push(as)
  }
  return aggregationObj
}

const addFieldsToAggregation = (addFieldObj, aggregationObj) => {
  const addFieldKey = addFieldObj.key
  // Check if the addField obj with same config already exists in the addFields array
  if (!aggregationObj.addFields.some(obj => (obj && obj[addFieldKey]))) {
    aggregationObj.addFields.push({ [addFieldKey]: addFieldObj.value })
    if (!aggregationObj.unset.includes(addFieldKey)) {
      aggregationObj.unset.push(addFieldKey)
    }
  }
  return aggregationObj
}

const prepareAggregateQuery = (aggregationObj, filterQuery, sortOptions, skip, limit) => {
  const { aggregation, unset, addFields, sortKey } = aggregationObj
  let finalAggregation = []
  let countAggregation = []
  if (aggregation && aggregation.length > 0) {
    finalAggregation = handleAddFieldsAggregation(finalAggregation, addFields)
    if (sortKey === 'primary') {
      finalAggregation.push({ $sort: sortOptions }, ...aggregation, { $match: filterQuery })
    } else {
      finalAggregation.push(...aggregation, { $match: filterQuery }, { $sort: sortOptions })
    }
    countAggregation = [...aggregation, { $match: filterQuery }, { $count: 'count' }]
  } else if (addFields && addFields.length > 0) {
    finalAggregation = handleAddFieldsAggregation(finalAggregation, addFields)
    if (sortKey === 'primary') {
      finalAggregation.push({ $sort: sortOptions }, { $match: filterQuery })
    } else {
      finalAggregation.push({ $match: filterQuery }, { $sort: sortOptions })
    }
  }
  if (finalAggregation.length > 0) {
    finalAggregation.push(
      { $unset: unset },
      { $skip: skip },
      { $limit: limit }
    )
  }
  return { countAggregation, finalAggregation }
}

const handleAddFieldsAggregation = (finalAggregation, addFields) => {
  for (let i = 0; i < addFields.length; i++) {
    finalAggregation.push({
      $addFields: addFields[i]
    })
  }
  return finalAggregation
}

export default {
  queryBuilder
}