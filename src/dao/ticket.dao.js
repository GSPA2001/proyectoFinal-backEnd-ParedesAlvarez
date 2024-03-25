import ticketModel from '../models/ticket.model.js';

export class ticketService {
    constructor() {
    }

    async createTicket(ticketDetails) {
        const response = await ticketModel.create(ticketDetails);
        return response;
    }
}