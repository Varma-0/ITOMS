import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { tenantUpdate, permissionAdd, tenantAdd, tenantDelete } from 'src/app/services/login/body/body';
import { editTenantBody, addPermissionBody, addTenantBody, deleteTenantEVent } from 'src/app/services/login/body/event';
import { editTenantData, addPermissionData, addTenantData } from 'src/app/services/login/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss'
})
export class TenantsComponent {
  // day = 'Tue'
  // date = '20';
  // month = 'Aug';
  // tenantName = 'INA QUICKPAY';
  // tenantDetails = 'sandeepreddymukku143@gmail.com on 2024-06-06';
  // tenantType = 'COMPANY';
  isActive: boolean = true;
  // constructor(public dialog: MatDialog) {}
  tenants: any = []
  time: any = '';
  fulldate:any = '';
  day:any = '';
  date: any='';
  month: any = '';
  userDetails = '';
  userName = '';  
  filteredtenants = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];
  constructor(public dialog: MatDialog, private dataService: TerminalService) {}

  ngOnInit(): void {
    this.loadTenants();
  }

  loadTenants() {
    this.dataService.tenantData().subscribe(
      response => {
        console.log(response);
        this.tenants = response.event.eventData.tenants.map(data => ({
          tenantId: data.id,
          fulldate: data.createdBy.ts.split('T')[0],
          userName: data.createdBy.name,
          name: data.name,
          type: data.type,
          status: data.status
        }));
        this.search();
      },
      error => {
        console.error('Error:', error);
      }
    )
  }

  toggleStatus(tenant: any,i?): void {
    this.filteredtenants[i].status = this.filteredtenants[i].status == 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'; 
    tenant.status = tenant.isActive ? 'ACTIVE' : 'INACTIVE';
    console.log(`${tenant.name} status is now: ${tenant.status}`);
  }

  search(): void {
    this.filteredtenants = this.tenants.filter(device =>
      device.name.toLowerCase().includes(this.searchTerm.toLowerCase())
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

  openCreateDialog(data?,edit?): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
        data:{
            title:edit ? 'Edit Tenant' : 'Add Tenant',
            form : {
                name: data.name,
                description: data.description,
                type: data.type,
                stype: data.stype,
            }
        },
        width:'40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(edit) {
          const event = new editTenantData(data.tenantId,result.name,result.description,result.type,result.stype);
          const eventType = new editTenantBody(event,'TENANT','UPDATE');
          const finals = new tenantUpdate(eventType);
          this.dataService.updateTenant(finals).subscribe(
            response => [
              console.log("response",response)
            ]
          )
        }
        else if(!edit) {
          const event = new addTenantData(result.name,result.description,result.type,result.stype);
          const eventType = new addTenantBody(event,'TENANT','CREATE');
          const finals = new tenantAdd(eventType);
          this.dataService.addTenant(finals).subscribe(
            response => [
              console.log("response",response)
            ]
          )
        }
      }
    });
  }

  openDeleteDialog(tenants): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const eventType = new deleteTenantEVent(tenants.tenantId,'PERMISSION','ACTIVATE');
        const finals = new tenantDelete(eventType);
        this.dataService.deleteTenant(finals).subscribe(
          response => {
            console.log("respoonse",response);
          }
        )
    }
    });
  }
}
