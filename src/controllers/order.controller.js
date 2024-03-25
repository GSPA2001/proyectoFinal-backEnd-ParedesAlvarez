import { OrderService } from "../dao/orders.mongo.dao.js"

const service = new OrderService()

export class OrderController {
    constructor() {
    }

    async getOrders(type) {
        try {
            return await service.getOrders()
        } catch (err) {
            return err.message
        }
    }
}