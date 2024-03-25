import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

mongoose.pluralize(null)

const collection = 'products'

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: false },
    code: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true }
});

schema.plugin(mongoosePaginate)

export default mongoose.model(collection, schema)