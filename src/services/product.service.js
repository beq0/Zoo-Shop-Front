export class ProductService {
    constructor() {

    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    async getSuggestedPlaces(place) {
        const res = await (await fetch(`${Config.baseAPIUrl}/destination-autocomplete?place=${place}&token=${authService.getToken()}`)).json();
        let toRet = [];
        if (res.predictions) {
            for (let i = 0; i < res.predictions.length; i++) {
                let toConvert = res.predictions[i].description;
                toRet.push(toConvert);
            }
        }
        return toRet;
    }

    async getGeometryForPlace(place) {
        const res = await (await fetch(`${Config.baseAPIUrl}/find-place-from-text?place=${place}&token=${authService.getToken()}`)).json();
        return res;
    }
    
}