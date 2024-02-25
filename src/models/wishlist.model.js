import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema

const wishlistSchema = new Schema({
  products: [{
    type: ObjectId,
    ref: 'Product'
  }],
  user: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
})

export default mongoose.model('Wishlist', wishlistSchema)
