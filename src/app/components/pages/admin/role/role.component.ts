import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TerminalService } from 'src/app/services/terminal/devicelist';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent {
  roles: any = []
  permissionsData: any
  permissionsNames: any = [];
  filteredroles = [];
  time: any = '';
  fulldate:any = '';
  day:any = '';
  date: any='';
  month: any = '';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];
  constructor(public dialog: MatDialog, private dataService: TerminalService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.permissionApiResponse();
  }

  loadRoles() {
    this.dataService.roleData().subscribe(
      response => {
        console.log(response);
        this.roles = response.event.eventData.tenantRoles.map(data => ({
          fulldate: data.createdBy.ts.split('T')[0],
          name: data.name,
        }));
        this.search();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }

  permissionApiResponse() {
    this.dataService.permissionData().subscribe(
      response => {
        this.permissionsData = response.event.eventData.permissions
        this.permissionsData.forEach(name => {
          console.log("ythefuckisObje",name.name);
          this.permissionsNames.push(name.name);
          console.log("ythefuckisObje",this.permissionsNames);

        });
      }
    )
  }

  search(): void {
    this.filteredroles = this.roles.filter(device =>
      device.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredroles.length / this.itemsPerPage);
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
    return this.filteredroles.slice(startIndex, startIndex + this.itemsPerPage);
  }

  openCreateDialog(data?,edit?): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
        data:{
            title : edit ? 'Edit Role' : 'Add Role',
            permissionOptionNames : this.permissionsNames,
            form:{
                name: ['Test'],
                description: ['Test'],
                roles: [{
                    label : 'Dashboard',
                    view : true,
                    edit : false,
                    delete : false
                },
                {
                    label : 'Admin',
                    view : true,
                    edit : true,
                    delete : true
                }
            ]
            }
        },
        width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
}
  openDeleteDialog(roles): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
  }
}
