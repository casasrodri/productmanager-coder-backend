import mongoose from 'mongoose';
import ProductManagerFs from './fs/controllers/productManager.js';
import ProductManagerMongo from './mongo/controllers/productManager.js';
import CartManagerFs from './fs/controllers/cartManager.js';
import CartManagerMongo from './mongo/controllers/cartManager.js';
import MessageManagerMongo from './mongo/controllers/messsageManager.js';

export class DaoConnector {
    static type;

    static async setConnectionType(type) {
        switch (type) {
            case 'mongo':
                DaoConnector.type = type;

                const database = 'ecommerce';
                await mongoose.connect(
                    `mongodb+srv://rodri:rodri@cluster0.fhf3wmo.mongodb.net/${database}?retryWrites=true&w=majority`
                );

                console.log('Connection to MongoDB established successfully');

                break;
            case 'fs':
                DaoConnector.type = type;
                break;
            default:
                throw new Error(
                    `Please specify a valid connection type: 'mongo' or 'fs'. You specified ${type}`
                );
        }
    }

    static productManager() {
        switch (DaoConnector.type) {
            case 'mongo':
                return new ProductManagerMongo();
            case 'fs':
                return new ProductManagerFs();
            default:
                throw new Error(
                    `Please specify a valid connection type: 'mongo' or 'fs'. You specified ${DaoConnector.type}`
                );
        }
    }

    static cartManager() {
        switch (DaoConnector.type) {
            case 'mongo':
                return new CartManagerMongo();
            case 'fs':
                return new CartManagerFs();
            default:
                throw new Error(
                    `Please specify a valid connection type: 'mongo' or 'fs'. You specified ${DaoConnector.type}`
                );
        }
    }
}

export const daoManagersMiddleware = (req, res, next) => {
    req.productManager = DaoConnector.productManager();
    req.cartManager = DaoConnector.cartManager();
    next();
};
