import { Router } from 'express';
import { ProductManager } from '../Dao/ProductManager.js';
import { validateNumericId } from '../utils.js';

const router = Router();
const productManager = new ProductManager('./src/Data/products.json'); 

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts(); 
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/:pid', validateNumericId ,async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productManager.getProductById(Number(pid)); 
        if (!product) {
            return res.status(404).send(`Producto con ID ${pid} no encontrado.`);
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;
    const newProduct = { title, description, code, price, status, stock, category, thumbnails };
    try {
        const addedProduct = await productManager.addProduct(newProduct); 
        req.io.emit("newProduct", addedProduct);
        res.status(201).send("Producto agregado exitosamente");
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.put('/:pid', validateNumericId, async (req, res) => {
    const { pid } = req.params;
    const updatedFields = req.body;
    try {
        const updatedProduct = await productManager.updateProduct(Number(pid), updatedFields); 
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

router.delete('/:pid',validateNumericId, async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(Number(pid)); 
        req.io.emit("deleteProduct", Number(pid));
        res.status(200).send(`Producto con id ${pid} eliminado`);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});

export default router;
