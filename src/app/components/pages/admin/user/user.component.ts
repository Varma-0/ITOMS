import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import { SharedServices } from 'src/app/services/shared.service';
import { ActiveComponent } from 'src/app/components/dialogs/active/active.component';
import { createNewUserEvent, createUserData } from 'src/app/services/login/body/event-data';
import { createNewUserBody, createUserEvent } from 'src/app/services/login/body/event';
import { createNewUser, createUser } from 'src/app/services/login/body/body';
import { ViewTenantComponent } from 'src/app/components/dialogs/view-tenant/view-tenant.component';
import { OtpComponent } from 'src/app/components/dialogs/otp/otp.component';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss'
})
export class UserComponent {
    users: any = []
    filteredusers: any[] = [];
    paginatedusers: any[] = [];
    tenantsData: any;
    rolesData: any;
    alertsData: any;
    tenantsNames: any = [];
    rolesNames: any = [];
    alertsNames: any = [];
    time: any = '';
    fulldate: any = '';
    searchTerm = '';
    currentPage = 1;
    itemsPerPage = 5;
    totalPages = 1;
    itemsPerPageOptions = [5, 10, 15];
    loginData: any;
    hasEdit = false;
    hasDelete = false;
    formData;
    columns = [
        { name: 'User Name', visible: true },
        { name: 'Email', visible: true },
        { name: 'Created Date', visible: true },
        { name: 'Status', visible: true },
        { name: 'Tenants', visible: true },
      ];

      toggleColumn(index: number): void {
        this.columns[index].visible = !this.columns[index].visible;
      }

    constructor(public dialog: MatDialog, private dataService: TerminalService, private shared: SharedServices) { }

    ngOnInit(): void {
        this.loginData = localStorage.getItem("SA");
        if(this.loginData == 'true'){
            this.hasEdit = true;
            this.hasDelete = true;
        }else{
            let data = JSON.parse(localStorage.getItem("roles"));
            let item = data.filter(ele => ele.name == "USER");
            this.hasEdit = item[0].isAllowEdit
            this.hasDelete = item[0].isAllowDelete
        }
        this.loadDevices();
        this.tenantsApiResponse()
        this.roleApiResponse();
        this.alertApiResponse();
    }

    loadDevices() {
        this.shared.showLoader.next(true);
        this.dataService.userData().subscribe(
            response => {
                if(response.status == 200) {
                    this.users = response.event.eventData.users.map(data => data);
                    console.log(this.users);
                    this.search();
                }
                this.shared.showLoader.next(false);
            },
            error => {
                this.shared.showLoader.next(false);
                this.shared.showError(error.message)
                console.error('Error:', error);
            }
        );
    }

    tenantsApiResponse() {
        this.shared.showLoader.next(true);
        this.dataService.tenantData().subscribe(
            response => {
                this.tenantsData = response.event.eventData.tenants
                this.tenantsData.forEach(name => {
                    this.tenantsNames.push({
                        name: name.name,
                        id: name.id
                    });
                });
                this.shared.showLoader.next(false);
            },
            error => {
                this.shared.showLoader.next(false);
                this.shared.showError(error.message)
                console.error('Error:', error);
            }
        )
    }

    roleApiResponse() {
        this.shared.showLoader.next(true);
        this.dataService.roleData().subscribe(
            response => {
                this.rolesData = response.event.eventData
                this.rolesData.forEach(name => {
                    this.rolesNames.push({
                        name: name.name,
                        id: name.id
                    });
                });
                this.shared.showLoader.next(false);
            },
            error => {
                this.shared.showLoader.next(false);
                this.shared.showError(error.message)
                console.error('Error:', error);
            }
        )
    }

    alertApiResponse() {
        this.shared.showLoader.next(true);
        this.dataService.alertData().subscribe(
            response => {
                this.alertsData = response.event.eventData
                this.alertsData.forEach(name => {
                    this.alertsNames.push({
                        name: name.name,
                        id: name.id
                    });
                });
                this.shared.showLoader.next(false);
            },
            error => {
                this.shared.showLoader.next(false);
                this.shared.showError(error.message)
                console.error('Error:', error);
            }
        )
    }

    openViewDialog(data) {
        const dialogRef = this.dialog.open(ViewTenantComponent, {
            data: {
                id: data.uid,
            },
            width: '60%'
        });
        console.log("result", data);
        dialogRef.afterClosed().subscribe(result => {
            console.log("result", result);
            if (result) {

            }
        });
    }

    openOTPDialog(email, id) {
        const dialogRef = this.dialog.open(OtpComponent, {
            data: {
                email: email,
                id: id
            },
            width: '40%'
        });
        dialogRef.afterClosed().subscribe(result => {
            this.loadDevices()
        });
    }


    async openCreateDialog(data?, edit?: boolean): Promise<void> {
        if (edit) {
            const payload = {
                "event": {
                    "eventData": {
                        "uid": data.uid
                    },
                    "eventType": "USER",
                    "eventSubType": "SEARCH"
                }
            };

            this.shared.showLoader.next(true);
            this.dataService.getUserInfo(payload).subscribe(
                response => {
                    if (response.status == 200) {
                        const userData = response.event.eventData.userDetails;
                        const userDataList = response.event.eventData.userLinkDataList;
                        this.openDialog(userData,userDataList, edit, data.uid);
                    } else {
                        this.shared.showError("Failed to fetch user details");
                    }
                    this.shared.showLoader.next(false);
                },
                error => {
                    this.shared.showError("Failed to fetch user details");
                    this.shared.showLoader.next(false);
                }
            );
        } else {
            // For adding new user, open dialog directly
            this.openDialog(null,null, edit, null);
        }
    }

    private openDialog(userData: any,userDataList: any, isEdit: boolean, userId: string | null): void {
        const dialogRef = this.dialog.open(AddFormComponent, {
            data: {
                title: isEdit ? 'Edit User' : 'Add User',
                tenantOptionNames: this.tenantsNames,
                roleOptionNames: this.rolesNames,
                alertOptionNames: this.alertsNames,
                form: isEdit ? {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    dob: userData.dob,
                    email: userData.email,
                    phone: userData.phone,
                    country: userData.country,
                    altemail: userData.emailAlt,
                    altphone: userData.phoneAlt,
                    altcountry: userData.countryAlt,
                    roles : userDataList
                } : {}
            },
            width: '60%'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (isEdit) {
                    const payload = {
                        "event": {
                            "eventData": {
                                "id": userId,
                                "firstName": result.firstName,
                                "lastName": result.lastName,
                                "dob": result.dob,
                                "email": result.email,
                                "phone": result.phone,
                                "country": result.country,
                                "emailAlt": result.altemail,
                                "phoneAlt": result.altphone,
                                "countryAlt": result.altcountry
                            },
                            "eventType": "USER",
                            "eventSubType": "UPDATE"
                        }
                    };

                    this.shared.showLoader.next(true);
                    this.dataService.updateUser(payload).subscribe(
                        response => {
                            if(response.status == 200) {
                                this.shared.showSuccess("User Edited Successfully");
                                this.loadDevices();
                            }
                            this.shared.showLoader.next(false);
                        },
                        error => {
                            this.shared.showError("Failed to update user");
                            this.shared.showLoader.next(false);
                        }
                    );
                } else {
                    if (this.loginData != 'true') {
                        result.userLinkDataList = [
                            {
                                "role": {
                                    "id": result.role,
                                    "name": result.roleName
                                },
                                "alerts": result.alert
                            },
                        ]
                    } else {
                        result.userLinkDataList = result.tenants;
                    }
                    this.loginData === 'true' ?
                        this.addNewUserBySA(
                            result.firstName,
                            result.lastName,
                            result.dob,
                            result.email,
                            result.phone,
                            result.country,
                            result.altemail,
                            result.altphone,
                            result.altcountry,
                            result.userLinkDataList,
                            userId
                        ) :
                        this.createdNewUser(
                            result.firstName,
                            result.lastName,
                            result.dob,
                            result.email,
                            result.phone,
                            result.country,
                            result.altemail,
                            result.altphone,
                            result.altcountry,
                            result.userLinkDataList,
                            userId
                        );
                }
            }
        });
    }

    addNewUserBySA(firstName, lastName, dob, email, phone, country, altemail, altphone, altcountry, userLinkDataList, id) {
        this.shared.showLoader.next(true);
        const event = new createNewUserEvent(firstName, lastName, dob, email, phone, country, altemail, altcountry, altphone, userLinkDataList); //pass uid based on user selected
        const eventData = new createNewUserBody(event, 'USER', 'CREATE');
        const eventType = new createNewUser(eventData);
        this.dataService.addNewUserBySA(eventType).subscribe(
            response => {
                if(response.status == 200) {
                    this.openOTPDialog(email, id);
                    this.shared.showSuccess("User Created Successfully");
                }
                this.shared.showLoader.next(false);
            },
            error => {
                this.shared.showLoader.next(false);
                this.shared.showError(error.message)
                console.error('Error:', error);
            }
        );
    }

    createdNewUser(firstName, lastName, dob, email, phone, country, altemail, altphone, altcountry, userLinkDataList, id) {
        this.shared.showLoader.next(true);
        const event = new createNewUserEvent(firstName, lastName, dob, email, phone, country, altemail, altcountry, altphone, userLinkDataList); //pass uid based on user selected
        const eventData = new createNewUserBody(event, 'USER', 'CREATE');
        const eventType = new createNewUser(eventData);
        this.dataService.addNewUserBySA(eventType).subscribe(
            response => {
                if(response.status == 200) {
                    this.openOTPDialog(email, id);
                    this.shared.showSuccess("User Created Successfully");
                }
                this.shared.showLoader.next(false);
            },
            error => {
                this.shared.showLoader.next(false);
                this.shared.showError(error.message)
                console.error('Error:', error);
            }
        );
    }

    search(): void {
        this.filteredusers = this.users.filter(device =>
            device.name?.toLowerCase().includes(this.searchTerm?.toLowerCase())
        );
        this.updatePagination();
    }

    updatePagination(): void {
        this.totalPages = Math.ceil(this.filteredusers.length / this.itemsPerPage);
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
        return this.filteredusers.slice(startIndex, startIndex + this.itemsPerPage);
    }

    openActiveDialog(data, id): void {
        if (this.loginData == 'true') {
            const dialogRef = this.dialog.open(ActiveComponent, {
                data: {
                    title: data == 'active' ? 'In Active Tenants' : 'Active Tenants',
                    id: id
                },
                width: '25%'
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.loadDevices();
                }
            });
        } else {
            this.shared.showLoader.next(true);
            const payload = {
                "event": {
                    "eventData": [
                        id
                    ],
                    "eventType": "USER",
                    "eventSubType": data == 'active' ? "ACTIVATE" : "DEACTIVATE"
                }
            }
            this.dataService.updateUserStatus(payload).subscribe(res => {
                if(res.status == 200) {
                    this.shared.showSuccess("Status update successful!");
                    this.loadDevices()
                }
                this.shared.showLoader.next(false);
            }),
            error => {
                this.shared.showLoader.next(false);
                this.shared.showError(error.message)
                console.error('Error:', error);
            }
        }
    }

    openDeleteDialog(device): void {
        const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                // Implement delete functionality here
                console.log('User deleted');
            }
        });
    }
}
