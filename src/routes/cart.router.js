import express from "express";
import { CartManager } from "../cartManager.js";
const cartManager = new CartManager();

export const routerCarts = express.Router();
routerCarts.use(express.json());
routerCarts.use(express.urlencoded({ extended: true }));

routerCarts.get("/:cid", (req, res) => {
    const cartId = req.params.cid;
    const cart = cartManager.getCart(cartId);

    if (cart) {
        return res.status(201).json({
            status: "success",
            msg: `cart: ${cartId}`,
            data: cart,
        })
    } else {
        return res.status(404).json({
            status: "error",
            msg: `cart: ${cartId}, not exist. Add a product please`,
            data: {},
        })
    }
});

routerCarts.post("/:cid/product/:pid", (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid
    const productAddToCart = cartManager.addItemToCart(cartId, productId);
    const cart = cartManager.getCart(cartId);

    if (productAddToCart) {
        return res.status(201).json({
            status: "success",
            msg: "Product added",
            data: cart,
        })
    } else {
        return res.status(404).json({
            status: "error",
            msg: "Product not added",
            data: {},
        }) 
    }
});