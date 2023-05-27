import fs from 'fs';


export class ProductManager {
    
    constructor () {
        this.products = [];
        this.path = "products.json"
        this.id = 0;
        const productsString = JSON.stringify(this.products)
        fs.writeFileSync(this.path, productsString)
    }
    async getProducts(){
        const productsBeta =  await fs.promises.readFile(this.path, "utf-8");
        this.products = JSON.parse(productsBeta);
        console.log(this.products);
        return this.products;
    }
    async getProductById(id){
        const productsById = await fs.promises.readFile(this.path, "utf-8");
        this.products = JSON.parse(productsById);
        const found = this.products.find(prod => prod.id == id);
        if(found){
            console.log(found)
            return found;
        } else {
            console.log("Not found")
        }
    }
    async #getProductByCode(code){
        const productsByCode = await fs.promises.readFile(this.path, "utf-8");
        this.products = JSON.parse(productsByCode);
        const codeExist = this.products.find(prod => prod.code == code);
        if(codeExist){
            return true;
        } else {
            return false;
        }
    }
    async addProduct(newProduct) {
        const prodFs = await fs.promises.readFile(this.path, "utf-8");
        this.products = JSON.parse(prodFs)



        let title = newProduct.title;
        let description = newProduct.description;
        let price = newProduct.price;
        let thumbnail = newProduct.thumbnail;
        let code = newProduct.code;
        let stock = newProduct.stock;
        let category = newProduct.category;
        let status = newProduct.status;

        if(title === undefined || title === null || title === '' || description === undefined || description === null || description === '' || price === undefined || price === null || price === '' || code === undefined || code === null || code === '' || stock === undefined || stock === null || stock === '' || category === undefined || category === null || category === '') {
            console.log('Error, you must complete all fields');
            return false;
        }else if (typeof title != "string" || typeof description != "string" || typeof code != "string" || typeof category != "string" ){         
            console.log("title, description, code, and category must be a string") 
            return false;
        }else if (typeof price != "number" || typeof stock != "number" ){         
            console.log("price and number must be a number")
            return false;
        }else if (typeof status != "boolean"){         
            console.log("status must be a boolean")
            return false;
        }else if(await this.#getProductByCode(code)){
            console.log("The code entered has already been used, please enter another") 
            return false;
        }else {
            newProduct = {title, description, price, thumbnail, code, stock, category, status, id: this.id++};
            this.products.push(newProduct)
            const productsString = JSON.stringify(this.products)
            await fs.promises.writeFile(this.path, productsString)
            console.log(newProduct)
            return true
        }
    }
    
    async deleteProduct(id) {
        const fileProducts = await fs.promises.readFile(this.path, "utf-8");
        const fileProductsParse = JSON.parse(fileProducts);
    
        const positionProduct = fileProductsParse.findIndex(
        (prod) => prod.id == id
        );
    
        if (positionProduct == -1) {
            console.log("Product not found");
            return false;
        } else {
            delete fileProductsParse[positionProduct];
            const productsDelete = fileProductsParse.filter(
            (prod) => prod !== undefined
        );
    
        const productsString = JSON.stringify(productsDelete);
        await fs.promises.writeFile(this.path, productsString);
        return true;
        }
    }


    async updateProduct(id, {title, description, price, thumbnail, code, stock, category, status}) {
        const prodFs = await fs.promises.readFile(this.path, "utf-8");
        this.products = JSON.parse(prodFs)
        let found = this.products.find(p => p.id === id)
        const codeProduct = code
        if (found) {
            if(title === undefined || title === null || title === '' || description === undefined || description === null || description === '' || price === undefined || price === null || price === '' || stock === undefined || stock === null || stock === '') {
                console.log('Error, you must complete all fields');      
            }else if(await this.#getProductByCode(codeProduct)){
                console.log("The code entered has already been used, please enter another")
            }else {
            this.products[id] = Object.assign(found, {title, description, price, thumbnail, code, stock, category, status})
            const productsString = JSON.stringify(this.products)
            await fs.promises.writeFile(this.path, productsString)
            console.log("Updated product!")
            console.log(this.products)
            return(this.products)
            }
        } else {
            console.log("Product not found")
        }
    }
}


