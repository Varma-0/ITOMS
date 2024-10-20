import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-reports-dialog',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsDialogComponent {
  keys: string[] = [];
  dataArray: any[] = [];
  hasData: boolean = false;
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];
  constructor(public dialogRef: MatDialogRef<ReportsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any[],private shared:SharedServices) {
    if (data && data.length) {
      this.dataArray = data;
      this.keys = Object.keys(data[0]);
      this.hasData = true;
    }
    this.shared.setSidebarState(false);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.updatePagination();
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
    console.log("dww",this.totalPages);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  updateItemsPerPage(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  get paginatedDevices(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.data.slice(startIndex, startIndex + this.itemsPerPage);
  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
