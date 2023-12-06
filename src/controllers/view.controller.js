import { productRepository, userRepository } from '../repositories/index.js';
import { generateMockProducts } from '../utils/faker.js';
import { CustomError, errorTypes } from '../services/errors/customError.js';
import logger from '../utils/logger.js'
import config from '../config/config.js';
import jwt from 'jsonwebtoken'

export default class ViewController {
    redirectLogIn(req, res) {
        res.redirect('/login');
    }

    logIn(req, res) {
        res.render('login');
    }

    signUp(req, res) {
        res.render('signup');
    }

    async viewProducts(req, res) {
        const products = await productRepository.getProducts();
        res.render('home', { products: products });
    }

    async products(req, res) {
        const options = {};

        options['products'] = await productRepository.getProductsPaginate(req);
        options['user'] = req.session.name;
        options['session'] = JSON.stringify(req.session);

        if (req.user) options.user = req.user.first_name;

        try {
            res.render('products', options);
        } catch (err) {
            throw new CustomError({
                name: 'ViewProductsError',
                message: err.message,
                cause: 'Error rendering products',
                type: errorTypes.ROUTING,
                statusCode: 404,
            });
        }
    }

    async realTimeProducts(req, res) {
        let products = await productRepository.getProducts();

        products.forEach((product) => {
            if (!product.id) {
                product.id = product._id;
            }
        });

        res.render('realTimeProducts', { products: products });
    }

    async showCart(req, res) {
        res.render('cart', { cid: req.params.cid });
    }

    async chat(req, res) {
        res.render('chat');
    }

    logOut(req, res) {
        res.cookie('jwt', '', { maxAge: 1 });

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Logout error',
                    data: { err },
                });
            } else {
                res.clearCookie('connect.sid');
                res.clearCookie('jwt');
                res.render('login');
            }
        });
    }

    async mockingProducts(req, res) {
        const products = generateMockProducts(100);
        res.json(products);
    }

    async loggerTest(req, res) {

        const date = new Date();

        logger.fatal('Info log at ' + date);
        logger.error('Debug log at ' + date);
        logger.warning('Error log at ' + date);
        logger.info('Warning log at ' + date);
        logger.http('HTTP log at ' + date);
        logger.debug('Verbose log at ' + date);

        res.send('Logger test at ' + date);
    }

    async forgotPassword(req, res) {
        res.render('forgotPassword');
    }


    async resetPassword(req, res) {
        const { token } = req.params
        let verifiedToken, user

        try {
            // TODO: Tomar desde el .env
            verifiedToken = jwt.verify(token, config.jwtSecret)

            user = await userRepository.getById(verifiedToken.user_reset)
        } catch (err) {
            console.log(err)
            return res.render('forgotPassword', { error: true, message: 'Invalid or expired token. Please try again.' })
        }

        // res.render('reset');
        // res.json({ token })
        res.render('resetPassword', { email: user.email, exp: verifiedToken.exp, token })
    }
}
