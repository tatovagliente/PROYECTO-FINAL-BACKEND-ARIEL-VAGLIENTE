import { Router } from 'express';
import { CartManager } from '../Dao/CartManager.js';
import { ProductManager } from '../Dao/ProductManager.js';
import { procesaErrores } from '../utils.js';

const router = Router();
const productManager = new ProductManager('./src/Data/products.json'); 
const cartManager = new CartManager('./src/Data/carts.json'); 

router.get("/", async (req, res) => {
    try {
        let allProducts = await productManager.getProducts(); 
        res.render("home", {
            titulo: "Productos",
            products: allProducts
        });
    } catch (error) {
        procesaErrores(res, error);
    }
});

router.get("/realtimeproducts", async (req, res) => {
    try {
        let allProducts = await productManager.getProducts();
        res.render("realtimeproducts", {
            titulo: "Productos en tiempo real",
            products: allProducts
        });
    } catch (error) {
        procesaErrores(res, error);
    }
});

export default router;
