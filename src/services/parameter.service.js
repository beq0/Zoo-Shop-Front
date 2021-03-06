import * as Config from '../config.json';

export class ParameterService {
    constructor() {

    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    async findParameters() {
        return (await fetch(Config.baseUrl + '/api/parameter/findParameters', {
            method: 'GET'
        })).json();
    }

    async getParameter(name, parameterType, defaultValue) {
        const parameter = {
            name,
            parameterType,
            defaultValue
        }
        const res = await (await fetch(Config.baseUrl + '/api/parameter/getParameter', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(parameter)
        })).json();
        return res;
    }

    async addParameter(parameter) {
        const res = await (await fetch(Config.baseUrl + '/api/parameter/add', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(parameter)
        })).json();
        return res;
    }

    async changeParameter(parameter) {
        const res = await (await fetch(Config.baseUrl + '/api/parameter/change', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(parameter)
        })).json();
        return res;
    }

    async delete(parameterId) {
        return (await fetch(Config.baseUrl + '/api/parameter/delete/' + parameterId, {
            method: 'DELETE'
        })).json();
    }

}