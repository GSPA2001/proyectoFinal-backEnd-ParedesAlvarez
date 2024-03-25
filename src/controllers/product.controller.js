import { ProductService } from "../dao/products.mongo.dao.js"

const service = new ProductService()

export class ProductController {
    constructor() {
    }

    async addProduct(product) {
        try {
            return await service.addProduct()
        } catch (err) {
            return err.message
        }
    }

    async getProducts() {
        try {
            return await service.getProducts()
        } catch (err) {
            return err.message
        }
        
    }

    async getProduct(id) {
        try {
            return await service.getProduct(id); // Pasar el ID como argumento
        } catch (err) {
            return err.message;
        }
    }

    async getProductsPaginated(options) {
        try {
          const productsData = await service.getProductsPaginated(options);
          const plainProducts = productsData.docs.map(doc => doc.toObject());
      
          return {
            ...productsData,
            docs: plainProducts,
          };
        } catch (err) {
          console.error("Error in getProductsPaginated:", err);
          throw err;
        }
    }           
        
    async updateProduct(id, newContent) {
        try {
            return await service.updateProduct()
        } catch (err) {
            return err.message
        }
    }

    async deleteProduct(id) {
        try {
            return await service.deleteProduct()
        } catch (err) {
            return err.message
        }
    }
}
