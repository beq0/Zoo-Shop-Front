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

    async findHistories(filters, page) {
        return (await fetch(Config.baseUrl + '/history/findHistories/' + page + '/2', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(filters)
        })).json();
    }

    async getCount() {
        return (await fetch(Config.baseUrl + '/history/getCount', {
            method: 'GET'
        })).json();
    }
    
}