import express from "express";
import handlebars from "express-handlebars";
import { ProductManager } from "./productManager.js";
import { routerProducts } from "./routes/products.router.js";
import { routerViewProducts } from "./routes/products.view.router.js";
import { routerViewRealTimeProducts } from "./routes/realtimeproducts.view.router.js";
import { routerCarts } from "./routes/cart.router.js";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";

const app = express();
const port = 8080;

const productManager = new ProductManager();

const httpServer = app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
const socketServer = new Server(httpServer)


app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);

app.use("/view/products", routerViewProducts)
app.use("/view/realtimeproducts", routerViewRealTimeProducts)

app.use(express.static(__dirname + "/public"));


app.get("*", (req, res) => {
    res.status(404).send({
        status: "error",
        data: "Page not found",
    });
});

socketServer.on("connection", (socket) =>{
    console.log(`New Connection: ${socket.id}`);
    socket.on("new-product", async (newProduct) => {
        try {
            await productManager.addProduct(newProduct);
            const productsList = await productManager.getProducts();
            socketServer.emit("products", { productsList });
        } catch (error){
            console.log(error);
        }
    });
    socket.on("id-to-delete", async (id) => {
        try {
            console.log("el id es " + id)
            await productManager.deleteProduct(id);
            const productsListDeleted = await productManager.getProducts();
            socketServer.emit("products-deleted", { productsListDeleted });
        } catch (error){
            console.log(error);
        }
    });
});






productManager.addProduct({
    "title": "Producto 6",
    "description": "Producto 6 Vistas",
    "price": 6000,
    "code": "ABC600",
    "stock": 60,
    "category": "prueba",
    "status": true
});



