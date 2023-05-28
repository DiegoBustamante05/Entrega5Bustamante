import express from "express";
import { ProductManager } from "../productManager.js";

const productManager = new ProductManager();

export const routerViewProducts = express.Router();




routerViewProducts.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        return res.render('home', { title: "Products", products: products} );
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "error getting products" })
    }
});
