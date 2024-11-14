import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrl: './view-data.component.scss'
})
export class ViewDataComponent {

  collapsedKeys: Set<string> = new Set();
  toggledKeys: { [key: string]: boolean } = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { items: any },
    private dialogRef: MatDialogRef<ViewDataComponent>,private shared:SharedServices
  ) {
    this.shared.setSidebarState(false)
  }
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  toggleCollapse(key: string) {
    if (this.collapsedKeys.has(key)) {
      this.collapsedKeys.delete(key);
    } else {
      this.collapsedKeys.add(key);
    }
  }

  isCollapsed(key: string): boolean {
    return this.collapsedKeys.has(key);
  }

  closeModal() {
    this.isModalOpen = false;
    this.dialogRef.close(true);
  }

  ngOnDestroy(): void {
    this.shared.setSidebarState(true)
  }
}
