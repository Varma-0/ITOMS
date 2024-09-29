import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { merchantAdd, merchantDelete } from 'src/app/services/login/body/body';
import { addMerchantBody, deleteMerchantEVent } from 'src/app/services/login/body/event';
import { addMerchantData } from 'src/app/services/login/body/event-data';
import { SharedServices } from 'src/app/services/shared.service';
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
    hasEdit: boolean;
    hasDelete: boolean;
    columns = [
        { name: 'Merchant Name', visible: true },
        { name: 'Contact Name', visible: true },
        { name: 'Email', visible: true },
        { name: 'Created Date', visible: true },
      ];

      toggleColumn(index: number): void {
        this.columns[index].visible = !this.columns[index].visible;
      }
  constructor(public dialog: MatDialog, private dataService: TerminalService, private shared: SharedServices) { }

  ngOnInit(): void {
    if(localStorage.getItem("SA") == 'true'){
        this.hasEdit = true;
        this.hasDelete = true;
    }else{
        let data = JSON.parse(localStorage.getItem("roles"));
        let item = data.filter(ele => ele.name == "MERCHANT");
        this.hasEdit = item[0].isAllowEdit
        this.hasDelete = item[0].isAllowDelete
    }
    this.loadMerchants();
  }

  loadMerchants() {
    this.shared.showLoader.next(true);
    const event = new terminalEvent('MERCHANT', 'SEARCH');
    const merchantRequest = new terminalBody(event);
    this.merchants = this.dataService.merchantData(merchantRequest).subscribe(
      response => {
        if(response.status == 200) {
          this.merchants = response.event.eventData.map(data => ({
            merchantId: data.id,
            fulldate: data.createdBy.ts.split("T")[0],
            name: data.name,
            email: data.email,
            contactName: data.contactName
          }));
          this.search();
        }
        this.shared.showLoader.next(false);
      },
      error => {
        this.shared.showLoader.next(false);
        this.shared.showError(error.message)
        console.error('Error:', error);
      }
    )
  }



  search(): void {
    this.filteredmerchants = this.merchants.filter(device =>
      device.name?.toLowerCase().includes(this.searchTerm?.toLowerCase())
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

  updateItemsPerPage(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  get paginatedDevices(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredmerchants.slice(startIndex, startIndex + this.itemsPerPage);
  }

  openCreateDialog(data?): void {
    const dialogRef = this.dialog.open(AddFormComponent,{
        data:{
            title: 'Add Merchant',
          //   form : {
          //     name: data.name,
          //     email:data.email,
          //     phone: data.permission,
          //     cname: data.contactName,
          // }
        },
        width:'40%'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.shared.showLoader.next(true);
        const event = new addMerchantData(result.name,result.email,result.phone,result.cname);
        const eventType = new addMerchantBody(event,'MERCHANT','CREATE');
        const finals = new merchantAdd(eventType);
        this.dataService.addMerchant(finals).subscribe(
          response => {
            if(response.status == 200) {
              console.log('response', response);
              this.loadMerchants();
              this.shared.showSuccess("Merchant Created successfully!")
            }
            this.shared.showLoader.next(false);
          }
        )
      }
  });
  }

  openDeleteDialog(merchant): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shared.showLoader.next(true);
        const eventType = new deleteMerchantEVent(merchant.merchantId,'MERCHANT','DELETE');
        const finals = new merchantDelete(eventType);
        this.dataService.deleteMerchant(finals).subscribe(
          response => {
            if(response.status == 200) {
              console.log('response', response);
              this.loadMerchants();
              this.shared.showSuccess("Merchant Deleted successfully!");
            }
            this.shared.showLoader.next(false);
          }
        )
    }
    });
  }
}
