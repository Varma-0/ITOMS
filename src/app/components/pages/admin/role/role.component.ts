import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { roleAdd, roleUpdate } from 'src/app/services/login/body/body';
import { addRoleBody, updateRoleBody } from 'src/app/services/login/body/event';
import { addRoleData, updateRoleData } from 'src/app/services/login/body/event-data';
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
          roleId: data.id,
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
          this.permissionsNames.push({
            name : name.name,
            id : name.id
          });
          console.log("ythefuckisObje",this.permissionsNames);

        });
      }
    )
  }

  search(): void {
    this.filteredroles = this.roles.filter(device =>
      device.name?.toLowerCase().includes(this.searchTerm?.toLowerCase()) && !device.deleted
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
                name: data.name,
                description: data.description,
                roles: data.roles
            }
        },
        width: '40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(edit) {
          const event = new updateRoleData(data.roleId,result.roles);
          const eventType = new updateRoleBody(event,'ROLE','UPDATE');
          const finals = new roleUpdate(eventType);
          this.dataService.updateRoles(finals).subscribe(
            response => {
              console.log("resssss",response);
              this.loadRoles();
            }
          )
        }
        else if(!edit) {
        console.log(result);
          const event = new addRoleData(result.data.name,result.data.description,result.roles);
          const eventType = new addRoleBody(event,'ROLE','CREATE');
          const finals = new roleAdd(eventType);
          this.dataService.addRoles(finals).subscribe(
            response => {
              console.log("resssss",response);
              this.loadRoles();
            }
          )
        }
      }
    });
}
  openDeleteDialog(roles): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const payload = {
            "event": {
                "eventData": {
                    "id":"c0a83801-8e2c-160b-818e-2da8e7cc009b"
                },
                "eventType": "ROLE",
                "eventSubType": "DEACTIVATE"
            }
        }
        this.dataService.deleteRole(payload).subscribe((res) => {
            console.log(res);
            this.loadRoles();
        })
      }
    });
  }
}
