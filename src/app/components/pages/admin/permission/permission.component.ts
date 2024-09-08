import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss'
})
export class PermissionComponent {
  // day = 'Tue'
  // date = '20';
  // month = 'Aug';
  // alertName = 'DASHBOARD';
  // userDetails = 'Sandeep Reddy on 2024-06-06';
  // constructor(public dialog: MatDialog) {}
  permissions: any = []
  time: any = '';
  fulldate:any = '';
  day:any = '';
  date: any='';
  month: any = '';
  userDetails = '';
  userName = '';
  filteredpermissions = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];
  constructor(public dialog: MatDialog, private dataService: TerminalService) {}

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions() {
    this.dataService.permissionData().subscribe(
      response => {
        console.log(response);
        this.permissions = response.event.eventData.permissions.map(data => ({
          fulldate: data.createdBy.ts.split('T')[0],
          userName: data.createdBy.name,
          name: data.name
        }));
        this.search();
      },
      error => {
        console.error('Error:', error);
      }
    )
  }

  search(): void {
    this.filteredpermissions = this.permissions.filter(device =>
      device.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredpermissions.length / this.itemsPerPage);
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
    return this.filteredpermissions.slice(startIndex, startIndex + this.itemsPerPage);
  }

  openCreateDialog(data?,edit?): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
        data:{
            title: edit ? 'Edit Permission' : 'Add Permission',
            form : {
                name: ['test'],
                description: ['Test'],
                permission: ['Default'],
                checkbox1: ['true'],
                checkbox2: ['true'],
                checkbox3: ['true'],
            }
        },
        width:'40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
  }

  openDeleteDialog(permission): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
  }
}
