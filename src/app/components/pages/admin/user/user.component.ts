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

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {
  users: any = []
  filteredusers: any[] = [];
  paginatedusers: any[] = [];
  tenantsData:any;
  rolesData:any;
  alertsData:any;
  tenantsNames: any = [];
  rolesNames: any = [];
  alertsNames: any = [];
  time: any = '';
  fulldate:any = '';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];
  loginData: any;
  constructor(public dialog: MatDialog, private dataService: TerminalService,private shared:SharedServices) {}

  ngOnInit(): void {
    this.loginData = localStorage.getItem("SA");
    console.log("uigfiqw",this.loginData);
    this.loadDevices();
    this.loginData === 'true' ? this.tenantsApiResponse() : console.log("check");
    this.roleApiResponse();
    this.alertApiResponse();
  }

  loadDevices() {
    this.dataService.userData().subscribe(
      response => {
        this.users = response.event.eventData.users.map(data => ({
          userId: data.uid,
          name: data.name,
          email: data.email,
          fulldate: data.createdBy.ts.split('T')[0],
          status: data.status
        }));
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
            name : name.name,
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
            name : name.name,
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
            name : name.name,
            id: name.id
          });
        });
      }
    )
  }

  openCreateDialog(data?,edit?): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
     data : {
        title : edit ? 'Edit User' : 'Add User',
        tenantOptionNames : this.tenantsNames,
        roleOptionNames : this.rolesNames,
        alertOptionNames : this.alertsNames,
        form : {
            tenant: ['PAYQ'],
            role: ['IT_ADMIN'],
            alert: 'DEVICE SWAPPED',
            firstName: 'Sandeep',
            lastName: 'Reddy',
            dob: '2000-06-06',
            email: 'sandeep@gmail.com',
            phone: '1234567891',
            country: 'INDIA',
            altemail: 'sandy@gmail.com',
            altphone: '2211221122',
            altcountry: 'INDIA',
          }
     },
     width : '60%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if(edit) {
          const event = new createUserData(result.uid); //pass uid based on user selected
          const eventType = new createUserEvent(event,'USER','SEARCH');
          const eventData = new createUser(eventType);
          this.dataService.editUser(eventData).subscribe(
            response => {
              console.log(response);
            }
          )
        }
        else if(!edit) {
         if(this.loginData != 'true'){
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
         }else{
            result.userLinkDataList = result.tenants;
         }
        this.loginData === 'true' ? this.addNewUserBySA(result.firstName,result.lastName,result.dob,result.email,result.phone,result.country,result.altemail,result.altphone,result.altcountry,result.userLinkDataList) : this.createdNewUser(result.firstName,result.lastName,result.dob,result.email,result.phone,result.country,result.altemail,result.altphone,result.altcountry,result.userLinkDataList);
        }
      }
    });
  }

  addNewUserBySA(firstName,lastName,dob,email,phone,country,altemail,altphone,altcountry,userLinkDataList) {
    const event = new createNewUserEvent(firstName,lastName,dob,email,phone,country,altemail,altphone,altcountry,userLinkDataList); //pass uid based on user selected
    const eventData = new createNewUserBody(event,'USER','CREATE');
    const eventType = new createNewUser(eventData);
    console.log("1212",eventType);
    this.dataService.addNewUserBySA(eventType).subscribe(
      response => {
        console.log(response);
      }
    );
  }

  createdNewUser(firstName,lastName,dob,email,phone,country,altemail,altphone,altcountry,userLinkDataList) {
    const event = new createNewUserEvent(firstName,lastName,dob,email,phone,country,altemail,altphone,altcountry,userLinkDataList); //pass uid based on user selected
    const eventData = new createNewUserBody(event,'USER','CREATE');
    const eventType = new createNewUser(eventData);
    console.log("1212",eventType);
    this.dataService.addNewUser(eventType).subscribe(
      response => {
        console.log(response);
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

  openActiveDialog(data): void {
    const dialogRef = this.dialog.open(ActiveComponent,{
        data : {
            title : data == 'active' ? 'In Active Tenants' : 'Active Tenants',
            items: [
                { label: 'Option 1', checked: false },
                { label: 'Option 2', checked: false },
                { label: 'Option 3', checked: false },
                { label: 'Option 4', checked: false }
              ]
        },
        width : '25%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
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
