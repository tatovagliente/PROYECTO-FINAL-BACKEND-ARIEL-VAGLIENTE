const socket = io();
const divProducts = document.querySelector("#products");


socket.on("newProduct", (product) => {
    const liProduct = document.createElement("li");
    liProduct.innerHTML = `
        <h2>PRODUCTO: ${product.title}</h2>
        <h3>DESCRIPCIÓN: ${product.description}</h3>
        <p>PRECIO: $${product.price}</p>
        <p>CODIGO: ${product.code}</p>
        <p>STOCK: ${product.stock}</p>
    `;
    divProducts.appendChild(liProduct);
});

socket.on("updateProducts", (products) => {
    divProducts.innerHTML = ""; // Limpiar la lista actual
    products.forEach((product) => {
        const liProduct = document.createElement("li");
        liProduct.innerHTML = `
            <h2>PRODUCTO: ${product.title}</h2>
            <h3>DESCRIPCIÓN: ${product.description}</h3>
            <p>PRECIO: $${product.price}</p>
            <p>CODIGO: ${product.code}</p>
            <p>STOCK: ${product.stock}</p>
        `;
        divProducts.appendChild(liProduct);
    });
});