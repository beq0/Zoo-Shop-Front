import moment from "moment";

export class DateFormats {
    constructor() {
    }

    static formatDateTime(date) {
        return moment(date).format('DD-MM-YYYY HH:mm:ss')
    }

    static formatDate(date) {
        return moment(date).format('DD-MM-YYYY')
    }

    static toDate(date) {
        if(!date) return;
        let tmp = date.split('-');
        return new Date(tmp[1] + '-' + tmp[0] + '-' + tmp[2]);
    }
}