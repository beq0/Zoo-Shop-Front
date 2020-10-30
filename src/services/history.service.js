import * as Config from '../config.json';

export class HistoryService {
    constructor() {

    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    async getHistories() {
        return (await fetch(Config.baseUrl + '/history/findAll', {
            method: 'GET'
        })).json();
    }

    addHistory(history) {
        fetch(Config.baseUrl + '/history/add', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(history)
        })
    }

    async findHistories(filters, page, limit) {
        return (await fetch(Config.baseUrl + '/history/findHistories/' + page + '/' + limit, {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(filters)
        })).json();
    }

    async getCount(filter) {
        return (await fetch(Config.baseUrl + '/history/getCount', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(filter)
        })).json();
    }
    
}