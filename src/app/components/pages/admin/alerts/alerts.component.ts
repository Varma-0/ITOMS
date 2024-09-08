import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss'
})
export class AlertComponent {
  // day = 'Tue'
  // date = '20';
  // month = 'Aug';
  // alertName = 'DEVICE SWAPPED';
  // userDetails = 'sandeepreddymukku143@gmail.com on 2024-06-06';
  // constructor(public dialog: MatDialog) {}
  alerts: any = []
  time: any = '';
  fulldate:any = '';
  day:any = '';
  date: any='';
  month: any = '';
  userDetails = '';
  userName = '';
  filteredalerts = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];
  constructor(public dialog: MatDialog, private dataService: TerminalService) {}

  ngOnInit(): void {
    this.loadAlerts();
    
  }

  loadAlerts() {
    this.dataService.alertData().subscribe(
      response => {
        console.log(response);
        this.alerts = response.event.eventData.alerts.map(data => ({
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
    this.filteredalerts = this.alerts.filter(device =>
      device.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredalerts.length / this.itemsPerPage);
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
    return this.filteredalerts.slice(startIndex, startIndex + this.itemsPerPage);
  }


  openCreateDialog(data?,edit?): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
        data: {
            title: edit ? 'Edit Alert' : 'Add Alert',
            form : {
                name: 'Test',
                originator: 'Server',
                alert: 'Low',
                template: 'Email',
                description: 'Test',
                checkbox1: 'true',
                checkbox2: 'true',
                checkbox3: 'true',
                tvalue: '121',
                dvalue: '112',
                minvalue: '11',
                maxvalue: '12',
                templateId: '11',
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

  openDeleteDialog(alert): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
  }
}
