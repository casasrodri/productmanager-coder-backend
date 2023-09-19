import mongoose from 'mongoose';

const productCollection = 'products';
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnail: String,
    status: Boolean,
});

const Product = mongoose.model(productCollection, productSchema);

export default Product;
