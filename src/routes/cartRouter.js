import { Router } from 'express';
import { CartManager } from '../Dao/CartManager.js';
import { validateNumericId } from '../utils.js';

const router = Router();
const cartManager = new CartManager('./src/Data/carts.json'); 

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart(); 
        res.status(201).send(newCart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/:cid', validateNumericId, async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(Number(cid));
        if (!cart) {
            return res.status(404).send(`Carrito con ID ${cid} no encontrado.`);
        }
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/:cid/product/:pid', validateNumericId, async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const updatedCart = await cartManager.addProductToCart(Number(cid), Number(pid));
        req.io.emit("cartUpdated", updatedCart);
        res.status(200).send(`Producto con ID ${pid} agregado al carrito con ID ${cid}.`);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

export default router;
