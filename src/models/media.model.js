import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const mediaSchema = new Schema({
  name: String,
  url: {
    type: String
  },
  fileType: {
    type: String,
    enum: ['image', 'video']
  },
  category: {
    type: String,
    enum: ['user', 'product', 'review']
  },
  uploadedBy: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
})

export default mongoose.model('Media', mediaSchema)
