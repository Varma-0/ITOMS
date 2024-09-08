import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reports-dialog',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsDialogComponent {
  keys: string[] = [];
  dataArray: any[] = [];
  hasData: boolean = false;

  constructor(public dialogRef: MatDialogRef<ReportsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any[]) {
    if (data && data.length) {
      this.dataArray = data;
      this.keys = Object.keys(data[0]);
      this.hasData = true;
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
