import mongoose from 'mongoose'
import productModel from '../models/product.model.js'

mongoose.pluralize(null)

const collection = 'carts'

const schema = new mongoose.Schema({
    products: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'products' }, // ref a la colección
    total: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

schema.pre('find', function() {
    this.populate({ path: 'products.pid', model: productModel })
})

export default mongoose.model(collection, schema)