import * as Config from '../config.json';
import sha256  from 'js-sha256';

export class ProductService {
    constructor() {

    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }
    
    async addProduct(product) {
        const res = await (await fetch(Config.baseUrl + '/api/product/add', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(product)
        })).json();
        return res;
    }
    
    async changeProduct(product) {
        product.password = sha256(product.password);
        const res = await (await fetch(Config.baseUrl + '/api/product/change', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(product)
        })).json();
        return res;
    }

    async getProducts() {
        return (await fetch(Config.baseUrl + '/api/product/findAll', {
            method: 'GET'
        })).json();
    }

    async delete(productId, password) {
        return (await fetch(Config.baseUrl + '/api/product/delete/' + productId + '/' + sha256(password), {
            method: 'DELETE'
        })).json();
    }

    async addProductsFromFile(file) {
        let formData = new FormData();
        formData.append("file", file);
        let options = {
            method: 'POST',
            body: formData
        }
        return (await fetch(Config.baseUrl + '/api/product/addProducts', options)).json();
    }

    async findProducts(filters) {
        return (await fetch(Config.baseUrl + '/api/product/findProducts', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(filters)
        })).json();
    }

    async sellProduct(_id, amount, sellingPrice, sellDate, description) {
        const req = {
            _id,
            amount,
            sellingPrice, 
            sellDate,
            description
        } 
        const res = await (await fetch(Config.baseUrl + '/api/product/sellProduct', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(req)
        })).json();
        return res;
    }
}