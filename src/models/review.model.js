import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema

const reviewSchema = new Schema({
  product: {
    type: ObjectId,
    ref: 'Product'
  },
  buyer: {
    type: ObjectId,
    ref: 'User'
  },
  rating: {
    type: Number,
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  images: [{ type: ObjectId, ref: 'Media' }],
  videos: [{ type: ObjectId, ref: 'Media' }],
}, {
  timestamps: true,
  versionKey: false
})

export default mongoose.model('Review', reviewSchema)
