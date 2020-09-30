import * as Config from '../config.json';

export class ProductService {
    constructor() {

    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    // async getSuggestedPlaces(place) {
    //     const res = await (await fetch(`${Config.baseAPIUrl}/destination-autocomplete?place=${place}&token=${authService.getToken()}`)).json();
    //     let toRet = [];
    //     if (res.predictions) {
    //         for (let i = 0; i < res.predictions.length; i++) {
    //             let toConvert = res.predictions[i].description;
    //             toRet.push(toConvert);
    //         }
    //     }
    //     return toRet;
    // }
    
    async addProduct(product) {
        const res = await (await fetch(Config.baseUrl + '/product/add', {
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

    async deleteProduct(productId) {
        return (await fetch(Config.baseUrl + '/product/delete/' + productId, {
            method: 'DELETE'
        })).json();
    }
}