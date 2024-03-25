import productModel from '../models/product.model.js'

export class ProductService {
    constructor() {
    }

    async addProduct(product) {
        try {
            await productModel.create(product)
            return "Producto agregado"
        } catch (err) {
            return err.message
        }
    }

    async getProducts() {
        try {
            const products = await productModel.find().lean()
            return products
        } catch (err) {
            return err.message
        }
        
    }

    async getProduct(id) {
        try {
            const product = await productModel.findById(id)
            return product === null ? 'No se encuentra el producto' : product
        } catch (err) {
            return err.message
        }
    }

    async getProductsPaginated(options) {
        try {
          return await productModel.paginate({}, options);
        } catch (err) {
          console.error("Error in getProductsPaginated:", err);
          throw err;
        }
    }                

    async updateProduct(id, newContent) {
        try {
            const procedure = await productModel.findByIdAndUpdate(id, newContent)
            return procedure
        } catch (err) {
            return err.message
        }
    }

    async deleteProduct(id) {
        try {
            const procedure = await productModel.findByIdAndDelete(id)
            return procedure
        } catch (err) {
            return err.message
        }
    }
}