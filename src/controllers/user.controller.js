import { UserService } from "../dao/users.mongo.dao.js"
import { faker } from '@faker-js/faker';
import{ createHash } from '../utils.js';

const service = new UserService()

export class UserController {
    constructor() {
    }

    async getUsers() {
        try {
            return await service.getUsers()
        } catch (err) {
            return err.message
        }
        
    }

    async getUsersPaginated(page, limit) {
        try {
            return await service.getUsersPaginated(page, limit);
        } catch (err) {
            return err.message;
        }
    }    
    
    async generateMockUsers(qty){
        const mockCarts = [];
        const mockUsers = [];
        const possibleRoles = ['user','premium','ADMIN'];
        for (let i = 0; i < qty; i++){
            const carts = {
                _id:faker.database.mongodbObjectId(),
                products:[],
                total: 0
            }
            mockCarts.push(carts);

            const user= {
                _id: faker.database.mongodbObjectId(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                age: faker.number.int(70) + 1,
                gender: faker.person.sex(),
                password: createHash(faker.internet.password({ length: 8 })),
                cart: mockCarts[i]._id,
                //cart: 0,
                role: faker.helpers.arrayElement(Object.values(possibleRoles))
            };
            mockUsers.push(user);
        }
        return [mockCarts, mockUsers];
    }

    async upgradeToPremium(req, res) {
        try {
            const { uid } = req.params;
            const user = await service.getUserById(uid);
    
            if (!user) {
                return res.status(404).send({ status: "ERR", message: "User not found" });
            }
    
            // Verificar si el usuario ha cargado los documentos requeridos
            if (!user.documents || user.documents.length === 0) {
                return res.status(400).send({ status: "ERR", message: "User must upload required documents before upgrading to premium" });
            }
    
            if (user.role !== "user") {
                return res.status(400).send({ status: "ERR", message: "User is not a regular user" });
            }
    
            user.role = "premium";
            await service.updateUser(user);
    
            return res.status(200).send({ status: "OK", message: "User upgraded to premium" });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ status: "ERR", message: "Internal server error" });
        }
    }    

    async uploadDocuments(req, res) {
        try {
            const { uid } = req.params;
            const user = await service.getUserById(uid);

            if (!user) {
                return res.status(404).send({ status: "ERR", message: "User not found" });
            }

            const documents = req.files.map(file => ({
                name: file.originalname,
                reference: file.filename
            }));

            user.documents = user.documents || [];
            user.documents.push(...documents);
            await service.updateUser(user);

            return res.status(200).send({ status: "OK", message: "Documents uploaded successfully", documents });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ status: "ERR", message: "Internal server error" });
        }
    }
}