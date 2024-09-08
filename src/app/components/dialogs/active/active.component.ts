import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss'],
})
export class ActiveComponent {
    title = '';
    items = [];
      searchText = '';
  filteredItems = [];
  constructor(public dialogRef: MatDialogRef<ActiveComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title
    this.items = data.items
    this.filteredItems = data.items
  }

  get selectedCount(): number {
    return this.items.filter(item => item.checked).length;
  }


  selectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.items.forEach(item => item.checked = isChecked);
  }
  updateSelectAllState() {
    const allChecked = this.items.every(item => item.checked);
    const noneChecked = this.items.every(item => !item.checked);
  }

  filterItems() {
    const searchTerm = this.searchText?.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.label?.toLowerCase().startsWith(searchTerm)
    );
  }


  areAllChecked(): boolean {
    return this.items.length > 0 && this.items.every(item => item.checked);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

}
