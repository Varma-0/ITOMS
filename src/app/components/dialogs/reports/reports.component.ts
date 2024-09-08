import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-reports-dialog',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsDialogComponent {
  keys: string[] = [];
  values: string[] = [];
  constructor(public dialogRef: MatDialogRef<ReportsDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.keys = Object.keys(data);
    this.values = Object.values(data);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

}
