import express from "express";
import { ProductManager } from "./productManager.js";
import { routerProducts } from "./routes/products.router.js";
import { routerCarts } from "./routes/cart.router.js";

const productManager = new ProductManager();

const app = express();
const port = 8080;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", routerProducts)
app.use("/api/carts", routerCarts);

app.get("*", (req, res) => {
    res.status(404).send({
        status: "error",
        data: "Page not found",
    });
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});



