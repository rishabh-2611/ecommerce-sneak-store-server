import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    collation: { locale: 'en', strength: 1 }
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ["sneakers","boots", "sandals", "shoes", "heels", "slippers", "flip flops", "other"],
    default: 'other'
  },
  details:{
    _id: false,
    type: Object,
    brand: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      enum: ["men", "women", "unisex", "boy", "girl"],
      default: 'other'
    },
    material: {
      type: String,
      default: ''
    },
  },
  sizes: [{
    _id: false,
    name: String,
    quantity: Number,
  }],
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  originalPrice: {
    type: Number,
    required: true
  },
  rating: {
    type: Number
  },
  totalRatings: {
    type: Number
  },
  videos: [{ type: ObjectId, ref: 'Media' }],
  images: [{ type: ObjectId, ref: 'Media' }],
  seller: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
})

export default mongoose.model('Product', productSchema)
