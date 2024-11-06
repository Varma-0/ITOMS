import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { SharedServices } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor(private shared: SharedServices) {}

  // Convert Excel to JSON with validation for required columns
  async convertExcelToJson(file: File, requiredColumns: string[], missingColumns: any): Promise<{ headers: string[], data: any[] }> {
    const reader: FileReader = new FileReader();
    
    // Wrap FileReader operations in a Promise to use async/await
    const binaryStr = await new Promise<string>((resolve, reject) => {
      reader.onload = (e: any) => resolve(e.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });

    const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });

    // Get the first sheet
    const sheetName: string = workbook.SheetNames[0];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON and get column headers
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: true });

    if (jsonData.length > 0) {
      const headers = jsonData[0] as string[]; // First row as headers

      // Check if all required columns are present
      missingColumns.push(requiredColumns.filter(col => !headers.includes(col)));
      if (missingColumns[0].length > 0) {
        this.shared.showError(`Missing required columns: ${[...missingColumns].join(', ')}`);
      }

      // Convert the remaining rows into JSON using headers as keys
      const data = XLSX.utils.sheet_to_json(worksheet, { header: headers, raw: true, range: 1 });

      // Rename '__rowNum__' to 'rowNo'
      const modifiedData = data.map((item: any, index: number) => ({
        ...item,
        rowNo: index + 1, // Add row number starting from 1
        // Remove __rowNum__ if it exists
        ...('__rowNum__' in item && { __rowNum__: undefined })
      }));

      return { headers, data: modifiedData };
    } else {
      this.shared.showError('The sheet is empty.');
      throw new Error('The sheet is empty.');
    }
  }
}
