import express from "express";
import { ProductManager } from "../productManager.js";
import { uploader } from "../utils.js";
export const routerProducts = express.Router();


const productManager = new ProductManager();

routerProducts.use(express.json());
routerProducts.use(express.urlencoded({ extended: true }));


routerProducts.get("/", async (req, res) => {
    const allProducts = await productManager.getProducts();
    let limit = req.query.limit;

    if (!limit) {
        res.status(200).send({
            status: "success",
            data: allProducts,
        });
    } else if (limit > 0 && limit <= allProducts.length) {
        let productsLimit = allProducts.slice(0, limit);
        res.status(200).send({
            status: "success",
            data: productsLimit,
        });
    } else if (limit > allProducts.length) {
        res.status(400).send({
            status: "error",
            data: "Limit exceeds the products quantity",
        });
    } else {
        res.status(400).send({
            status: "error",
            data: "Limit has to be a number greater than or equal to 0",
        });
    }
});

routerProducts.get("/:pid", async (req, res) => {
    try {
        let productId = req.params.pid;
        let productFound = await productManager.getProductById(productId);
        res.status(200).send({
            status: "success",
            data: productFound,
        })   
    } catch (error) {
        return res.status(404).send({
            error: 'Product not found'
        })
    }
});

routerProducts.post("/", async (req, res) => {
    try {
        const newProduct = req.body;
        await productManager.addProduct(newProduct)
        return res.status(201).json({
            status: "success",
            msg: "Product created",
            data: newProduct,
        });
    } catch (error) {
        console.log(error)
        return res.status(404).send({
            error: 'Product not added'
        })
    }
})


routerProducts.delete("/:pid", async (req, res) => {
    try {
        const idToDelete = req.params.pid;
        await productManager.deleteProduct(idToDelete);
        console.log("Product "+ idToDelete + " deleted")
        return res.status(200).send({ 
            status: "success", 
            msg: "Product deleted",
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            status: "error",
            msg: "could not be deleted",
            data: {},
        });
    }
});


routerProducts.put("/:pid", async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const newProduct = req.body;
        await productManager.updateProduct(id, newProduct);
        console.log("Product "+ id + " was modified")
        return res.status(201).json({
            status: "success",
            msg: "successfully modified product",
            data: newProduct,
        });
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            status: "error",
            msg: "could not be modified, check the entered fields",
            data: {},
        });
    }
});