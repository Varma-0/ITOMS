import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { createUser } from 'src/app/services/login/body/body';
import { createUserEvent } from 'src/app/services/login/body/event';
import { createUserData } from 'src/app/services/login/body/event-data';
import { SharedServices } from 'src/app/services/shared.service';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-view-tenant',
  templateUrl: './view-tenant.component.html',
  styleUrl: './view-tenant.component.scss'
})
export class ViewTenantComponent {
  tenants: any = []
  filteredtenants: any[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];
  constructor(public dialog: MatDialog,private dataService: TerminalService,public dialogRef: MatDialogRef<ViewTenantComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices) {
    this.shared.setSidebarState(false);
  }

  ngOnInit(): void {
    this.loadTenants(this.data.id);
  }

  loadTenants(uid) {
    const payload = {
      "event": {
          "eventData": uid,
          "eventType": "USER",
          "eventSubType": "SEARCH"
      }
  }
    this.dataService.viewTenants(payload).subscribe(
      response => {
        this.tenants = response.event.eventData.userTenantLinks.map(data => ({
          userId: data.tenantName,
          status: data.status
        }));
        console.log(this.tenants);
        this.search();
      }
    );
  }

  search(): void {
    this.filteredtenants = this.tenants.filter(device =>
      device.name?.toLowerCase().includes(this.searchTerm?.toLowerCase())
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredtenants.length / this.itemsPerPage);
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
    return this.filteredtenants.slice(startIndex, startIndex + this.itemsPerPage);
  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
