import userModel from '../models/user.model.js'

export class UserService {
    constructor() {
    }

    async getUsers() {
        try {
            const users = await userModel.find().lean()
            // const users = await userModel.find({ first_name: 'Celia' }).explain('executionStats')
            return users
        } catch (err) {
            return err.message
        }
        
    }

    async getUsersPaginated(page, limit) {
        try {
            return await userModel.paginate(
                {},
                { offset: (page * limit) - limit, limit: limit, lean: true }
            );
        } catch (err) {
            return err.message;
        }
    }
    
}