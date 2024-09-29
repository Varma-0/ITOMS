import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { tenantUpdate, permissionAdd, tenantAdd, tenantDelete } from 'src/app/services/login/body/body';
import { editTenantBody, addPermissionBody, addTenantBody, deleteTenantEVent } from 'src/app/services/login/body/event';
import { editTenantData, addPermissionData, addTenantData } from 'src/app/services/login/body/event-data';
import { SharedServices } from 'src/app/services/shared.service';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-tenants',
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.scss'
})

export class TenantsComponent {
  tenants: any[] = [];
  filteredtenants: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  itemsPerPageOptions = [5, 10, 15];
  totalPages: number = 1;
    hasEdit: boolean;
    hasDelete: boolean;
    columns = [
        { name: 'Tenant Name', visible: true },
        { name: 'Created By', visible: true },
        { name: 'Updated By', visible: true },
        { name: 'Created Date', visible: true },
        { name: 'Updated Date', visible: true },
        { name: 'Tenant Type', visible: true }
      ];

      toggleColumn(index: number): void {
        this.columns[index].visible = !this.columns[index].visible;
      }
  constructor(public dialog: MatDialog, private dataService: TerminalService, private shared: SharedServices) {}

  ngOnInit(): void {
    this.shared.showLoader.next(true);
    this.loadTenants();
    if(localStorage.getItem("SA") == 'true'){
        this.hasEdit = true;
        this.hasDelete = true;
    }else{
        let data = JSON.parse(localStorage.getItem("roles"));
        let item = data.filter(ele => ele.name == "TENANT");
        this.hasEdit = item[0].isAllowEdit
        this.hasDelete = item[0].isAllowDelete
    }
    this.shared.showLoader.next(false);
  }

  loadTenants() {
    this.dataService.tenantData().subscribe(
      response => {
        this.tenants = response.event.eventData.tenants.map(data => ({
          tenantId: data.id,
          createdDate: data.createdBy.ts.split('T')[0],
          updatedDate: data.updatedBy.ts.split('T')[0],
          created: data.createdBy.userName,
          updated: data.updatedBy.userName,
          name: data.name,
          type: data.type,
          status: data.status
        }));
        this.search();
      },
      error => {
        console.error('Error:', error);
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

  toggleStatus(tenant: any, i: number,isChecked: boolean): void {
    const updatedStatus = isChecked ? 'ACTIVATE' : 'DEACTIVATE';
    // this.filteredtenants[i].status = updatedStatus;
    // tenant.status = updatedStatus;
    // console.log(`${tenant.tenantId} status is now: ${tenant.status}`);
    const payload = {
      "event": {
        "eventData":tenant.tenantId,
        "eventType": "TENANT",
        "eventSubType": updatedStatus
      }
    }
    this.dataService.tenantUpdateStatus(payload).subscribe(
      response => {
        // Update the device status in the UI if the API call is successful
        if(response.status == 200) {
          console.log('Device status updated successfully:', response);
          this.loadTenants();
          this.shared.showSuccess(`Tenant ${updatedStatus.toLowerCase()}d successfully!`)
        }
      },
      error => {
        // Handle any errors here
        console.error('Error updating device status:', error);
      }
    );
  }

  openCreateDialog(data?, edit?): void {
    const dialogRef = this.dialog.open(AddFormComponent, {
      data: {
        title: edit ? 'Edit Tenant' : 'Add Tenant',
        form: {
          name: data?.name || '',
          description: data?.description || '',
          type: data?.type || '',
          stype: data?.stype || '',
        },
      },
      width: '40%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (edit) {
          const event = new editTenantData(data.tenantId, result.name, result.description, result.type, result.stype);
          const eventType = new editTenantBody(event, 'TENANT', 'UPDATE');
          const finals = new tenantUpdate(eventType);
          this.dataService.updateTenant(finals).subscribe(
            response => {
              if(response.status == 200) {
                console.log('response', response);
                this.loadTenants();
                this.shared.showSuccess("Tenant Updated successfully!")
              }
            }
          );
        } else {
          const event = new addTenantData(result.name, result.description, result.type, result.stype);
          const eventType = new addTenantBody(event, 'TENANT', 'CREATE');
          const finals = new tenantAdd(eventType);
          this.dataService.addTenant(finals).subscribe(
            response => {
              if(response.status == 200) {
                console.log('response', response);
                this.loadTenants();
                this.shared.showSuccess("Tenant Created successfully!")
              }
            }
          );
        }
      }
    });
  }

  openDeleteDialog(tenants): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const eventType = new deleteTenantEVent(tenants.tenantId,'TENANT','DEACTIVATE');
        const finals = new tenantDelete(eventType);
        this.dataService.deleteTenant(finals).subscribe(
          response => {
            if(response.status == 200) {
              console.log('response', response);
              this.loadTenants();
              this.shared.showSuccess("Status Updated successfully!")
            }
          }
        );
      }
    });
  }
}

