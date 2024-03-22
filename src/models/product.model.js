import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
const Schema = mongoose.Schema
import { ProductCategories, ProductBrands, ProductGenders, ProductMaterials, ProductSizes, ProductStatuses } from '../constants/enums/product.enum.js'

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
  details:{
    _id: false,
    type: Object,
    category: {
      type: String,
      enum: ProductCategories,
      default: 'other'
    },
    brand: {
      type: String,
      enum: ProductBrands,
      default: ''
    },
    gender: {
      type: String,
      enum: ProductGenders,
      default: 'other'
    },
    material: {
      type: String,
      enum: ProductMaterials,
      default: "N/A"
    },
  },
  sizes: [{
    _id: false,
    name: {
      type: String,
      enum: ProductSizes
    },
    quantity: {
      type: Number,
    }
  }],
  totalStock: {
    type: Number,
  },
  originalPrice: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number
  },
  totalRatings: {
    type: Number
  },
  status: {
    type: String,
    enum: ProductStatuses,
    default: 'In stock'
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
