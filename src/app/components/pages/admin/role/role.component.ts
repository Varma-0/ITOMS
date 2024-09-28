import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { roleAdd, roleUpdate } from 'src/app/services/login/body/body';
import { addRoleBody, updateRoleBody } from 'src/app/services/login/body/event';
import { addRoleData, updateRoleData } from 'src/app/services/login/body/event-data';
import { SharedServices } from 'src/app/services/shared.service';
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
    fulldate: any = '';
    day: any = '';
    date: any = '';
    month: any = '';
    searchTerm = '';
    currentPage = 1;
    itemsPerPage = 5;
    totalPages = 1;
    itemsPerPageOptions = [5, 10, 15];
    hasEdit: boolean = false;
    hasDelete: boolean = false;
    columns = [
        { name: 'Role Name', visible: true },
        { name: 'Created Date', visible: true },
      ];

      toggleColumn(index: number): void {
        this.columns[index].visible = !this.columns[index].visible;
      }
    constructor(public dialog: MatDialog, private dataService: TerminalService, private shared: SharedServices) { }

    ngOnInit(): void {
        this.shared.showLoader.next(true);
        this.loadRoles();
        this.permissionApiResponse();
        if(localStorage.getItem("SA") == 'true'){
            this.hasEdit = true;
            this.hasDelete = true;
        }else{
            let data = JSON.parse(localStorage.getItem("roles"));
            let item = data.filter(ele => ele.name == "ROLE");
            this.hasEdit = item[0].isAllowEdit
            this.hasDelete = item[0].isAllowDelete
        }
        this.shared.showLoader.next(false);
    }

    loadRoles() {
        this.dataService.roleData().subscribe(
            response => {
                if(response.status == 200) {
                    console.log(response);
                    this.roles = response.event.eventData.map(data => data);
                    this.search();
                }
            },
            error => {
                this.shared.showError(error.message);
                console.error('Error:', error);
            }
        );
    }

    permissionApiResponse() {
        this.dataService.permissionData().subscribe(
            response => {
                this.permissionsData = response.event.eventData.permissions
                this.permissionsData.forEach(name => {
                    this.permissionsNames.push({
                        name: name.name,
                        id: name.id
                    });
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

    editData(data) {
        const payload = {
            "event": {
                "eventData": data.id,
                "eventType": "ROLE",
                "eventSubType": "SEARCH"
            }
        }
        this.dataService.getRole(payload).subscribe(
            response => {
                console.log(response.event.eventData.rolePermissionsList)
                data.roles = response.event.eventData.rolePermissionsList;
                this.openCreateDialog(data, true)
            }
        )
    }

    openCreateDialog(data?, edit?): void {
        const dialogRef = this.dialog.open(AddFormComponent, {
            data: {
                title: edit ? 'Edit Role' : 'Add Role',
                permissionOptionNames: this.permissionsNames,
                form: edit ? {
                    name: data.name,
                    description: data.description,
                    roles: data.roles,
                } : {}
            },
            width: '40%'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (edit) {
                    const payload = {
                        "event": {
                            "eventData": {
                                "id": data.id,
                                "description": result.data.description,
                                "rolePermissions": result.roles,
                            },
                            "eventType": "ROLE",
                            "eventSubType": "UPDATE"
                        }
                    }
                    this.dataService.updateRoles(payload).subscribe(
                        response => {
                            if(response.status == 200) {
                                this.loadRoles();
                                console.log("resssss", response);
                                this.shared.showSuccess("Role Updated successfully!")
                            }
                        }
                    )
                }
                else if (!edit) {
                    console.log(result);
                    const event = new addRoleData(result.data.name, result.data.description, result.roles);
                    const eventType = new addRoleBody(event, 'ROLE', 'CREATE');
                    const finals = new roleAdd(eventType);
                    this.dataService.addRoles(finals).subscribe(
                        response => {
                            if(response.status == 200) {
                                console.log("resssss", response);
                                this.loadRoles();
                                this.shared.showSuccess("Role created successfully")
                            }
                        }
                    )
                }
            }
        });
    }
    openDeleteDialog(role): void {
        const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const payload = {
                    "event": {
                        "eventData": {
                            "id": role.id
                        },
                        "eventType": "ROLE",
                        "eventSubType": "DEACTIVATE"
                    }
                }
                this.dataService.deleteRole(payload).subscribe((res) => {
                    if(res.status == 200) {
                        console.log(res);
                        this.loadRoles();
                        this.shared.showSuccess("Role Deleted successfully");
                    }
                })
            }
        });
    }
}
