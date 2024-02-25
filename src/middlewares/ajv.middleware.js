/**
 * ajv is a JSON schema validator
 * ajv-formats is used for addtional formats like eg:- email type
 * An online converter can be used for schema generation from a sample json
 * eg:- https://www.liquid-technologies.com/online-json-to-schema-converter
 */
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addErrors from 'ajv-errors'
import queryParams from '../validations/validation.js'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
addErrors(ajv)
ajv.addVocabulary(['schemaKey', 'entity', 'datatype', 'aggregation', 'search'])
ajv.addKeyword({
  keyword: 'isNotEmpty',
  validate: (schema, data) => {
    if (schema) {
      return typeof data === 'string' && data.trim() !== ''
    } else return true
  }
})
ajv.addKeyword('key')
ajv.addKeyword('value')


const validate = (schema) => {
  return (req, res, next) => {
    let errorMessage
    const params = req.params
    if (Object.keys(params).length) errorMessage = ajvValidate(queryParams.params, params)

    const query = req.query
    const body = req.body

    if(!Object.keys(query).length && !Object.keys(body).length) {
      return res.status(400).json({ message: "Please send valid data" })
    }

    if (Object.keys(query).length && !errorMessage) {
      if (schema) {
        errorMessage = ajvValidate(schema, query)
      } else {
        errorMessage = ajvValidate(queryParams.query, query)
      }
    }

    if (Object.keys(body).length && schema && !errorMessage) errorMessage = ajvValidate(schema, req.body)

    if (req.file && Object.keys(req.file).length) errorMessage = ajvValidate(queryParams.file, req.file)

    if (errorMessage) return res.status(400).json({ message: errorMessage })
    next()
  }
}


const ajvValidate = (schema, data) => {
  const valid = ajv.validate(schema, data)
  if (!valid) {
    return ajv.errors.length ? ajv.errors[0].message : 'Validation error!'
  }
}

export { validate as default }
