import { Router } from 'express';
import { ProductManager } from '../Dao/ProductManager.js';


const router = Router();
const productManager = new ProductManager('./src/Data/products.json',); 


router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

export default router;
