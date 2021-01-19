import * as Config from '../config.json';
import sha256  from 'js-sha256';

export class HistoryService {
    
    constructor() {

    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    async getHistories() {
        return (await fetch(Config.baseUrl + '/api/history/findAll', {
            method: 'GET'
        })).json();
    }

    addHistory(history) {
        fetch(Config.baseUrl + '/api/history/add', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(history)
        })
    }

    // pass 1 for histories with pagination, or 0 otherwise
    async findHistories(filters, page, limit, isPagination) {
        return (await fetch(Config.baseUrl + '/api/history/findHistories/' + page + '/' + limit + '/' + isPagination, {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(filters)
        })).json();
    }

    async getCount(filter) {
        return (await fetch(Config.baseUrl + '/api/history/getCount', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(filter)
        })).json();
    }

    async delete(historyId, password) {
        return (await fetch(Config.baseUrl + '/api/history/delete/' + historyId + '/' + sha256(password), {
            method: 'DELETE'
        })).json();
    }
    
}