import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const mediaSchema = new Schema({
  name: String,
  file: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  fileType: {
    type: String,
    enum: ['image', 'video']
  },
  type: {
    type: String,
    enum: ['user', 'product']
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
