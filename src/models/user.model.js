import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  isEnabled: Boolean,
  lastActivity: Date,
  role: {
    type: String,
    enum: ['admin', 'buyer', 'seller'],
    default: 'buyer'
  },
  credentials: {
    salt: String,
    password: String
  },
  details: {
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
  role: 'text'
})

export default mongoose.model('User', userSchema)
