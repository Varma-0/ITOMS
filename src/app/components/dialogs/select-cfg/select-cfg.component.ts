import { Component } from '@angular/core';
import {
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-select-cfg',
  templateUrl: './select-cfg.component.html',
  styleUrls: ['./select-cfg.component.scss'],
})
export class SelectCfgComponent {
  fileFormat: string = 'json';  // Default file format
  authorization: boolean = false;  // Default authorization switch state
  constructor(public dialogRef: MatDialogRef<SelectCfgComponent>) {}

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
