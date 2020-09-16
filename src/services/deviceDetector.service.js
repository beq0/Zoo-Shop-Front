export class DeviceDetectorService {
    static get isBrowser() {
        return typeof window !== 'undefined';
    }
}