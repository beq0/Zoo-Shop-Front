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
}