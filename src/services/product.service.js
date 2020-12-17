import * as Config from '../config.json';

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

    async delete(productId) {
        return (await fetch(Config.baseUrl + '/api/product/delete/' + productId, {
            method: 'DELETE'
        })).json();
    }

    async findProducts(filters) {
        return (await fetch(Config.baseUrl + '/api/product/findProducts', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(filters)
        })).json();
    }

    async sellProduct(_id, amount, sellingPrice, sellDate) {
        const req = {
            _id,
            amount,
            sellingPrice, 
            sellDate
        } 
        const res = await (await fetch(Config.baseUrl + '/api/product/sellProduct', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(req)
        })).json();
        return res;
    }
}