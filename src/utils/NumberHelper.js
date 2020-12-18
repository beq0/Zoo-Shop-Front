export class NumberHelper {
    constructor() {
    }

    static isZero(num) {
        return num === null || num === 0;
    }

    static isNonZero(num) {
        return !this.isZero(num);
    }
}