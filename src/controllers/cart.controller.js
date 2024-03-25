import FactoryService from '../dao/dao.factory.js';

const service = new FactoryService()

export class CartController {
    constructor() {
    }

    async getCarts() {
        try {
            return await service.getCarts();
        } catch (err) {
            return err.message
        }
    }

    async getTopCart() {
        try {
            return await service.getTopCart();
        } catch (err) {
            return err.message
        }
    }
}