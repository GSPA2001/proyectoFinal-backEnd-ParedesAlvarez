import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const collection = 'users'; 

const schema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number },
  password: { type: String, required: true },
  cart: { type: Schema.Types.ObjectId },
  rol: { type: String, enum: ['user', 'premium', 'ADMIN'], default: 'user' },
  documents: [{ name: String, reference: String }],
  last_connection: { type: Date, default: Date.now },
});

// Importamos mongoose-paginate-v2 y lo activamos como plugin, para tener disponible
// el método paginate() en las consultas
schema.plugin(mongoosePaginate);

export default mongoose.model(collection, schema);