import { FileSaverUtils } from "./FileSaver";

export class ExcelGenerator {
    
    constructor() {

    }

    static saveWithOneSheet(title, subject, author, sheetName, fileName, columnNames, content) {
        let wb = XLSX.utils.book_new();

        wb.Props = {
                Title: title,
                Subject: subject,
                Author: author,
                CreatedDate: new Date()
        };
        
        wb.SheetNames.push(sheetName);
        let ws_data = content;
        ws_data.unshift(columnNames);
        let ws = XLSX.utils.aoa_to_sheet(ws_data);
        wb.Sheets[sheetName] = ws;
        let wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});

        FileSaverUtils.saveExcelFile(wbout, fileName)
    }

}