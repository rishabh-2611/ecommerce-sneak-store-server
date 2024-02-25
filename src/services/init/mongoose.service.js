import mongoose from 'mongoose'
import config from 'config'

export default {
  initDB: function () {
    const mongooseOptions = { autoIndex: true }
    /** To Suppress deprecation warning */
    mongoose.set('strictQuery', true)

    mongoose.connect(config.mongodb.uri, mongooseOptions).then(

      () => { console.log('Mongodb database connection established successfully') },
      err => {
        console.error('Mongodb database connection failed!!')
        console.error(err)
      }
    )
  }
}
