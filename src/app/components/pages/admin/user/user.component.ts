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
    constructor(public dialog: MatDialog, private dataService: TerminalService, private shared: SharedServices) { }

    ngOnInit(): void {
        this.loginData = localStorage.getItem("SA");
        console.log("uigfiqw", this.loginData);
        this.loadDevices();
        this.tenantsApiResponse()
        this.roleApiResponse();
        this.alertApiResponse();
    }

    loadDevices() {
        this.dataService.userData().subscribe(
            response => {
                this.users = response.event.eventData.users.map(data => data);
                console.log(this.users);
                this.search();
            },
            error => {
                console.error('Error:', error);
            }
        );
    }

    tenantsApiResponse() {
        this.dataService.tenantData().subscribe(
            response => {
                this.tenantsData = response.event.eventData.tenants
                this.tenantsData.forEach(name => {
                    this.tenantsNames.push({
                        name: name.name,
                        id: name.id
                    });
                });
            }
        )
    }

    roleApiResponse() {
        this.dataService.roleData().subscribe(
            response => {
                this.rolesData = response.event.eventData
                this.rolesData.forEach(name => {
                    this.rolesNames.push({
                        name: name.name,
                        id: name.id
                    });
                });
            }
        )
    }

    alertApiResponse() {
        this.dataService.alertData().subscribe(
            response => {
                this.alertsData = response.event.eventData
                this.alertsData.forEach(name => {
                    this.alertsNames.push({
                        name: name.name,
                        id: name.id
                    });
                });
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


    openCreateDialog(data?, edit?): void {
        const dialogRef = this.dialog.open(AddFormComponent, {
            data: {
                title: edit ? 'Edit User' : 'Add User',
                tenantOptionNames: this.tenantsNames,
                roleOptionNames: this.rolesNames,
                alertOptionNames: this.alertsNames,
                form: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    dob: data.dob,
                    email: data.email,
                    phone: data.phone,
                    country: data.country,
                    altemail: data.emailAlt,
                    altphone: data.phoneAlt,
                    altcountry: data.countryAlt,
                }
            },
            width: '60%'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (edit) {
                    const payload =
                    {
                        "event": {
                            "eventData": {
                                "id": data.uid,
                                "firstName" : result.firstName,
                                "lastName" : result.lastName,
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
                    }
                    this.dataService.updateUser(payload).subscribe(
                        response => {
                            this.loadDevices()
                        }
                    );
                }
                else if (!edit) {
                    if (this.loginData != 'true') {
                        result.userLinkDataList = [
                            {
                                "tenant": {
                                    "id": result.tenant,
                                    "name": result.tenantName
                                },
                                "role": {
                                    "id": result.role,
                                    "name": result.roleName
                                },
                                "alerts": [
                                    {
                                        "id": result.alert,
                                        "name": result.alertName
                                    }
                                ]
                            },
                        ]
                    } else {
                        result.userLinkDataList = result.tenants;
                    }
                    this.loginData === 'true' ? this.addNewUserBySA(result.firstName, result.lastName, result.dob, result.email, result.phone, result.country, result.altemail, result.altphone, result.altcountry, result.userLinkDataList, data.uid) : this.createdNewUser(result.firstName, result.lastName, result.dob, result.email, result.phone, result.country, result.altemail, result.altphone, result.altcountry, result.userLinkDataList, data.uid);
                }
            }
        });
    }

    addNewUserBySA(firstName, lastName, dob, email, phone, country, altemail, altphone, altcountry, userLinkDataList, id) {
        const event = new createNewUserEvent(firstName, lastName, dob, email, phone, country, altemail, altcountry, altphone, userLinkDataList); //pass uid based on user selected
        const eventData = new createNewUserBody(event, 'USER', 'CREATE');
        const eventType = new createNewUser(eventData);
        this.dataService.addNewUserBySA(eventType).subscribe(
            response => {
                this.openOTPDialog(email, id);
            }
        );
    }

    createdNewUser(firstName, lastName, dob, email, phone, country, altemail, altphone, altcountry, userLinkDataList, id) {
        const event = new createNewUserEvent(firstName, lastName, dob, email, phone, country, altemail, altcountry, altphone, userLinkDataList); //pass uid based on user selected
        const eventData = new createNewUserBody(event, 'USER', 'CREATE');
        const eventType = new createNewUser(eventData);
        this.dataService.addNewUser(eventType).subscribe(
            response => {
                this.openOTPDialog(email, id);
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
                this.loadDevices()
            })
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
