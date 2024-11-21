import fs from "fs";

export class ProductManager {
    constructor(rutaArchivo) {
        this.path = rutaArchivo;
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                return JSON.parse(await fs.promises.readFile(this.path, { encoding: "utf-8" }));
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error al leer los productos:", error);
            return [];
        }
    }

    async addProduct(product) {
        const { title, description, price, thumbnails, code, stock, category, status = true } = product;

        if (!title || !description || !price || !thumbnails || !code || !stock || !category || !Array.isArray(thumbnails)) {
            throw new Error("Todos los campos son obligatorios y thumbnails debe ser un array de rutas.");
        }

        const products = await this.getProducts();

        const codeExiste = products.some((p) => p.code === code);
        if (codeExiste) {
            throw new Error(`El producto con el código ${code} ya existe`);
        }

        const nextId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;

        const newProduct = {
            id: nextId,
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status
        };

        products.push(newProduct);

        await this.saveProducts(products);

        io.emit("newProduct", newProduct);

        return newProduct;
    }

    async saveProducts(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
        } catch (error) {
            console.error("Error al guardar los productos:", error);
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find((p) => p.id === id) || null;
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);

        if (index === -1) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }

        products.splice(index, 1);
        await this.saveProducts(products);
        io.emit("updateProducts", products);
        return `Producto con id ${id} eliminado exitosamente`;
    }
}

