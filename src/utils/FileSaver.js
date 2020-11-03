import FileSaver from "file-saver";

export class FileSaverUtils {
    constructor() {

    }

    static saveExcelFile(excelBinary, fileName) {
        FileSaver.saveAs(new Blob([this.s2ab(excelBinary)], { type:"application/octet-stream" }), fileName + '.xlsx')
    }

    static s2ab(s) { 
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;    
    }

}