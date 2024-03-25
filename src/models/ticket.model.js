import mongoose from "mongoose";
import passport from "passport";
import User from "./user.model.js";

mongoose.pluralize(null);

const collection = "tickets";

const schema = new mongoose.Schema({
  code: {type: String, unique: true, required: true, default: () => Math.random().toString(36).substring(2) },// se genera un código único
  purchase_datetime: {type: Date, default: Date.now },
  amount: {type: Number,required: true },
  purchaser: {type: String,required: true },
  //purchaser: { type: mongoose Schema. Types.ObjectId, required: true, ref: 'users' },
});

export default mongoose.model(collection, schema);

passport.serializeUser((user, done) => {
    done(null, user._id)
})
    
passport.deserializeUser(async (id, done) => {
    try {
        done(null, await User.findById(id))
    } catch (err) {
        done(err.message)
    }
})