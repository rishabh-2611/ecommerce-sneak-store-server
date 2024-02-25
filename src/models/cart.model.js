import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema

const cartSchema = new Schema({
  items: [{
    _id: false,
    product: {
      type: ObjectId,
      ref: 'Product'
    },
    size: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
  }],
  user: {
    type: ObjectId,
    ref: 'User'
  },
  
}, {
  timestamps: true,
  versionKey: false
})

export default mongoose.model('Cart', cartSchema)
