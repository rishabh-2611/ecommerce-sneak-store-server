/** Import node modules */
import mongoose from 'mongoose'
/** Import App Modules */

const ObjectId = mongoose.Types.ObjectId
const updateOptions = { upsert: true, timestamps: false, strict: false }
const allDocPromises = []

const initMongoDB = async () => {
    // try {
    // ------> Add deafault initial db values here <------        
    //     await Promise.all(allDocPromises)
    //     console.log('MongoDB initialized successfully')
    // } catch (error) {
    //     console.error('Error in mongo init script: ', error)
    //     return false
    // }
}


export default {
  initMongoDB
}