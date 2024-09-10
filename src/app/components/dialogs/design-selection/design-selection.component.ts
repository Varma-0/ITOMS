import { Component } from '@angular/core';
import {
  MatDialogRef,
} from '@angular/material/dialog';
import * as JSZip from 'jszip';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-design-selection',
  templateUrl: './design-selection.component.html',
  styleUrls: ['./design-selection.component.scss'],
})
export class DesignSelectionComponent {
  paramTemplate: any[];
  profile: any[];
  error: string;
  constructor(public dialogRef: MatDialogRef<DesignSelectionComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  async onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      try {
        const result = await this.processZipFile(file);
        this.paramTemplate = result.paramTemplate;
        this.profile = result.profile;
        this.error = '';
        console.log('Param Template:', this.paramTemplate);
        console.log('Profile:', this.profile);
        this.dialogRef.close({
            type: 'zip',
            profile : this.profile,
            params : this.paramTemplate
        });
      } catch (error) {
        this.error = error.message;
        console.error('Error processing file:', error);
        this.paramTemplate = [];
        this.profile = [];
      }
    }
  }

  async processZipFile(file: File): Promise<{ paramTemplate: any[], profile: any[] }> {
    const zip = new JSZip();
    let zipContents;
    try {
      zipContents = await zip.loadAsync(file);
    } catch (error) {
      console.error('Error loading zip file:', error);
      throw new Error('Unable to load the zip file. Please ensure it\'s a valid zip archive.');
    }

    const excelFile:any = Object.values(zipContents.files).find((f:any) =>
      f.name.endsWith('.xlsx') || f.name.endsWith('.xls')
    );

    if (!excelFile) {
      console.error('No Excel file found in the zip archive');
      throw new Error('No Excel file found in the zip archive. Please ensure the zip contains an .xlsx or .xls file.');
    }

    const arrayBuffer = await excelFile.async('arraybuffer');
    return this.processExcelBuffer(arrayBuffer);
  }

  private async processExcelBuffer(buffer: ArrayBuffer): Promise<{ paramTemplate: any[], profile: any[] }> {
    const workbook = XLSX.read(buffer, { type: 'array' });

    const paramTemplate = this.processSheet(workbook.Sheets['Param Template'],1);
    const profile = this.processSheet(workbook.Sheets['Profile'],2);

    return { paramTemplate, profile };
  }

  private processSheet(sheet: XLSX.WorkSheet,index): any[] {
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Use the third row (index 2) as headers

    const headers = jsonData[index] as string[];

    // Start data from the fourth row (index 3)
    const data = jsonData.slice(3);

    return data.map(row => {
      const obj: { [key: string]: any } = {};
      headers.forEach((header, index) => {
        if (header) {
          // Trim and remove asterisks from header names
          const cleanHeader = header.trim().replace(/^\*/, '');
          obj[cleanHeader] = row[index];
        }
      });
      return obj;
    });
  }
}
