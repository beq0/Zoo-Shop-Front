import * as Config from '../config.json';

export class ProductService {
    constructor() {

    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }
    
    async addProduct(product) {
        const res = await (await fetch(Config.baseUrl + '/product/add', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(product)
        })).json();
        return res;
    }
    
    async changeProduct(product) {
        console.log(product);
        const res = await (await fetch(Config.baseUrl + '/product/change', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(product)
        })).json();
        return res;
    }

    async getProducts() {
        return (await fetch(Config.baseUrl + '/product/findAll', {
            method: 'GET'
        })).json();
    }

    async delete(productId) {
        return (await fetch(Config.baseUrl + '/product/delete/' + productId, {
            method: 'DELETE'
        })).json();
    }
}