import mongoose from 'mongoose';

export default class MongoSingleton {
    static #instance;

    constructor(mongoose_URL = process.env.MONGOOSE_URI) {
        mongoose.connect(mongoose_URL);
    }

    static getInstance(mongoose_URL = process.env.MONGOOSE_URI) {
        if (!this.#instance) {
            this.#instance = new MongoSingleton(mongoose_URL);
            //console.log('Conexión bbdd CREADA ✅');
        } else {
            //console.log('Conexión bbdd RECUPERADA 🔌');
        }

        return this.#instance;
    }
}