import { Component } from '@angular/core';
import {
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-design-selection',
  templateUrl: './design-selection.component.html',
  styleUrls: ['./design-selection.component.scss'],
})
export class DesignSelectionComponent {
  constructor(public dialogRef: MatDialogRef<DesignSelectionComponent>) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/zip') {
      // Handle file upload logic here
      console.log('Selected file:', file.name);
    } else {
      console.error('Please select a valid .zip file.');
    }
  }
}
