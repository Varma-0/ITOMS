import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFormComponent } from 'src/app/components/dialogs/add-form/add-form.component';
import { ConfirmDeleteDialogComponent } from 'src/app/components/dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { SharedServices } from 'src/app/services/shared.service';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
    selector: 'app-alerts',
    templateUrl: './alerts.component.html',
    styleUrl: './alerts.component.scss'
})
export class AlertComponent {
    alerts: any = []
    time: any = '';
    fulldate: any = '';
    day: any = '';
    date: any = '';
    month: any = '';
    userDetails = '';
    userName = '';
    filteredalerts = [];
    searchTerm = '';
    currentPage = 1;
    itemsPerPage = 5;
    totalPages = 1;
    itemsPerPageOptions = [5, 10, 15];
    hasEdit: boolean;
    hasDelete: boolean;
    columns = [
        { name: 'Alert Name', visible: true },
        { name: 'Created By', visible: true },
        { name: 'Updated By', visible: true },
        { name: 'Created Date', visible: true },
        { name: 'Updated Date', visible: true }
      ];

      toggleColumn(index: number): void {
        this.columns[index].visible = !this.columns[index].visible;
      }
    constructor(public dialog: MatDialog, private dataService: TerminalService, private shared: SharedServices) { }

    ngOnInit(): void {
        this.loadAlerts();
        if(localStorage.getItem("SA") == 'true'){
            this.hasEdit = true;
            this.hasDelete = true;
        }else{
            let data = JSON.parse(localStorage.getItem("roles"));
            let item = data.filter(ele => ele.name == "ALERT");
            this.hasEdit = item[0].isAllowEdit
            this.hasDelete = item[0].isAllowDelete
        }
    }

    loadAlerts() {
        this.shared.showLoader.next(true);
        this.dataService.alertData().subscribe(
            response => {
                console.log(response);
                this.alerts = response.event.eventData.map(data => data);
                this.search();
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
        this.filteredalerts = this.alerts.filter(device =>
            device.name?.toLowerCase().includes(this.searchTerm?.toLowerCase()) && device.status != "INACTIVE"
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

     openCreateDialog(data?, edit?) {
        const dialogRef = this.dialog.open(AddFormComponent, {
            data: {
                title: edit ? 'Edit Alert' : 'Add Alert',
                form: edit ? {
                    name: data.name,
                    originator: data.originator,
                    alert: data.priority,
                    template: data.templateType,
                    description: data.description,
                    checkbox1: data.thresholdApplicable,
                    checkbox2: data.customAlert,
                    checkbox3: data.allowAutoClose,
                    tvalue: data.thresholdValue,
                    dvalue: data.defaultValue,
                    minvalue: data.minVal,
                    maxvalue: data.maxVal,
                    templateId: data.templateId,
                } : {}
            },
            width: '40%'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
                if (edit) {
                    this.shared.showLoader.next(true);
                    const payload = {
                        "event": {
                            "eventData": {
                                "id" : data.id,
                                "originator": result.originator,
                                "description": result.description,
                                "priority": result.alert,
                                "thresholdApplicable": result.checkbox1 ? true : false,
                                "customAlert": result.checkbox2 ? true : false,
                                "allowAutoClose": result.checkbox3 ? true : false,
                                "thresholdValue": result.tvalue,
                                "defaultValue": result.dvalue,
                                "minVal": result.minvalue,
                                "maxVal": result.minvalue,
                                "templateId": result.templateId,
                                "templateType": result.template
                            },
                            "eventType": "ALERT",
                            "eventSubType": "UPDATE"
                        }
                    }
                    this.dataService.updateAlert(payload).subscribe(
                        response => {
                            if(response.status == 200) {
                                this.loadAlerts();
                                this.shared.showSuccess("Alert Created successfully!")
                            }
                            this.shared.showLoader.next(false);
                        },
                        error => {
                            this.shared.showLoader.next(false);
                            this.shared.showError(error.message)
                            console.error('Error:', error);
                        }
                    )
                } else {
                    this.shared.showLoader.next(true);
                    const payload = {
                        "event": {
                            "eventData": {
                                "name": result.name,
                                "originator": result.originator,
                                "description": result.description,
                                "priority": result.alert,
                                "thresholdApplicable": result.checkbox1 ? true : false,
                                "customAlert": result.checkbox2 ? true : false,
                                "allowAutoClose": result.checkbox3 ? true : false,
                                "thresholdValue": result.tvalue,
                                "defaultValue": result.dvalue,
                                "minVal": result.minvalue,
                                "maxVal": result.minvalue,
                                "templateId": result.templateId,
                                "templateType": result.template
                            },
                            "eventType": "ALERT",
                            "eventSubType": "CREATE"
                        }
                    }
                    this.dataService.addAlert(payload).subscribe(
                        response => {
                            if(response.status == 200) {
                                this.loadAlerts();
                                this.shared.showSuccess("Alert Updated successfully!")
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
            }
        });
    }

    openDeleteDialog(alert): void {
        const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent);
        console.log(alert);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.shared.showLoader.next(true);
                const finals = {
                    "event": {
                        "eventData": {
                            "id": alert.id
                        },
                        "eventType": "ALERT",
                        "eventSubType": "DEACTIVATE"
                    }
                }
                this.dataService.deleteAlertData(finals).subscribe(
                    response => {
                        if(response.status == 200) {
                            console.log("respoonse",response);
                            this.loadAlerts();
                            this.shared.showSuccess("Role Deleted successfully");
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
        });
    }
}
