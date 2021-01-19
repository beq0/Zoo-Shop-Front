import * as Config from '../config.json';
import sha256  from 'js-sha256';

export class ManagementService {
    constructor() {

    }

    static getInstance() {
        return this._instance || (this._instance = new this());
    }

    async addPassword(password) {
        const passwordHash = sha256(password);
        const res = await (await fetch(Config.baseUrl + '/api/management/addPassword', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify({password: passwordHash})
        })).json();
        return res;
    }

    async changePassword(oldPassword, newPassword) {
        const body = {
            oldPassword: sha256(oldPassword),
            newPassword: sha256(newPassword)
        }
        const res = await (await fetch(Config.baseUrl + '/api/management/changePassword', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(body)
        })).json();
        return res;
    }

    async findManagement() {
        return (await fetch(Config.baseUrl + '/api/management/findManagement', {
            method: 'GET'
        })).json();
    }
}