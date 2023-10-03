import { ProductManager } from './ProductManager.js';
const tienda = new ProductManager();
const products = await tienda.getProducts()

import express from 'express';
const PORT = 8080;
const app = express();

app.use(express.urlencoded({extended:true}))

app.get("/", (req, res) => {
  let htmlBody = ``;
  htmlBody += `<h1 style="">¡Bienvenido!</h1>`;
  htmlBody += `<a href="http://localhost:8080/products">Explora productos</a>`;
  res.send(htmlBody);
});

app.get("/products/", (req, res) => {  
  let limit = req.query.limit
  if (!limit) return res.json(products);
  if(isNaN(limit)) return res.json({response: 'Limite invalido, intenta con un numero.'})
  let productFilterLimit = products.slice(0,req.query.limit)
  res.json(productFilterLimit)
});

app.get("/products/:pid", (req, res) => {
  if(isNaN(req.params.pid)) return res.json({response: "El id debe ser un número!"});
  let product = products.find(producto => producto.id === Number(req.params.pid));
  if(!product) return res.json({response: "El producto no existe!"}); 
  res.json(product);
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
