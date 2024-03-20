import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  isEnabled: Boolean,
  lastActivity: Date,
  type: {
    type: String,
    enum: ['Admin', 'Buyer', 'Seller'],
    default: 'buyer'
  },
  credentials: {
    salt: String,
    password: String
  },
  details: {
    name: String,
    firstName: String,
    lastName: String,
  },
  image: {
    type: ObjectId,
    ref: 'Media'
  },
  cart: {
    type: ObjectId,
    ref: 'Cart'
  },
  wishlist: {
    type: ObjectId,
    ref: 'Wishlist'
  },
  addresses: [{
    _id: false,
    name: String,
    address: String,
    person: {
      name: String,
      contact: String
    }
  }],
  resetPasswordToken: String, 
  resetPasswordTokenExpiry: Date
}, {
  timestamps: true,
  versionKey: false
})

userSchema.index({
  email: 'text',
  'details.firstName': 'text',
  'details.lastName': 'text',
  'details.title': 'text',
  type: 'text'
})

export default mongoose.model('User', userSchema)
