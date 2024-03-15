const getRecordCounts = async (model, filterQuery = {}, aggregationObj = { }) => {
    const { countAggregation } = aggregationObj
    const countPromises = []
    let filteredRecords = 0
    let totalRecords = 0
    let data = []
    const countQuery = {}
    if (filterQuery.additionalQuery) {
      Object.assign(countQuery, filterQuery.additionalQuery)
      Object.assign(filterQuery, filterQuery.additionalQuery)
      delete filterQuery.additionalQuery
    }

    countPromises.push(model.find(countQuery).count().exec())
  
    if (countAggregation && countAggregation.length > 0) {
      countPromises.push(model.aggregate(countAggregation).exec())
      data = await Promise.all(countPromises)
      filteredRecords = data[1].length > 0 ? data[1][0].count : 0
    } else {
      countPromises.push(model.find(filterQuery).count().exec())
      data = await Promise.all(countPromises)
      filteredRecords = data[1] ? data[1] : 0
    }
  
    totalRecords = data[0] ? data[0] : 0
  
    return [
      totalRecords,
      filteredRecords
    ]
  }
  
  const addProjectionInAggregate = (finalAggregation, projection) => {
    if (Object.keys(projection).length > 0) {
      finalAggregation.push({ $project: projection })
    }
    return finalAggregation
  }
  
  export default {
    getRecordCounts,
    addProjectionInAggregate
  }