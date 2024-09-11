import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-terminal-profile',
  templateUrl: './terminal-profile.component.html',
  styleUrls: ['./terminal-profile.component.scss'],
})
export class TerminalProfileComponent {
    items;
    title;
  constructor(public dialogRef: MatDialogRef<TerminalProfileComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title;
    this.items = data.items;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

}
