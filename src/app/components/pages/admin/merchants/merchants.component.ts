import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { terminalBody } from 'src/app/services/terminal/body/body';
import { terminalEvent } from 'src/app/services/terminal/body/event-data';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-merchants',
  templateUrl: './merchants.component.html',
  styleUrl: './merchants.component.scss'
})
export class MerchantsComponent {
  // day = 'Tue'
  // date = '20';
  // month = 'Aug';
  // merchantName = 'Big_Sale_Mart';
  // merchantDetails = '2024-06-06';
  // merchantEmail = 'salebigmart@gmail.com'
  // merchantType = 'BIG CORP';
  merchants: any = []
  time: any = '';
  fulldate:any = '';
  day:any = '';
  date: any='';
  month: any = '';
  filteredmerchants = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  itemsPerPageOptions = [5, 10, 15];
  constructor(public dialog: MatDialog, private dataService: TerminalService) { }

  ngOnInit(): void {
   
    this.loadMerchants();
  }

  loadMerchants() {
    const event = new terminalEvent('MERCHANT', 'SEARCH');
    const merchantRequest = new terminalBody(event);
    this.merchants = this.dataService.merchantData(merchantRequest).subscribe(
      response => {
        this.merchants = response.event.eventData.map(data => ({
          fulldate: data.createdBy.ts.split("T")[0],
          name: data.name,
          email: data.email,
          contactName: data.contactName
        }));
        this.search();
      },
      error => {
        console.error('Error:', error);
      }
    )
  }



  search(): void {
    this.filteredmerchants = this.merchants.filter(device =>
      device.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updatePagination();
  }


  updatePagination() {
    this.totalPages = Math.ceil(this.filteredmerchants.length / this.itemsPerPage);
    this.currentPage = 1;
    this.paginate();
  }

  paginate() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredmerchants = this.filteredmerchants.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginate();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginate();
    }
  }

  openCreateDialog(data?): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
        data:{
            title:'Add Merchant'
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

  openDeleteDialog(merchant): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Implement delete functionality here
        console.log('User deleted');
      }
    });
  }
}
