import { Component, Inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.component.scss'],
})
export class ActiveComponent {
    title = '';
    id;
    items = [];
      searchText = '';
  filteredItems = [];
  constructor(private dataService: TerminalService,public dialogRef: MatDialogRef<ActiveComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.title = data.title
    this.id = data.id
    this.loadTenants(data.id);
  }

  get selectedCount(): number {
    return this.items.filter(item => item.checked).length;
  }

  loadTenants(uid) {
    const payload = {
      "event": {
          "eventData": uid,
          "eventType": "USER",
          "eventSubType": "SEARCH"
      }
  }
    this.dataService.viewTenants(payload).subscribe(
      response => {
        response.event.eventData.userTenantLinks.map(data => {
            if(this.title == 'In Active Tenants'){
                if(data.status == "INACTIVE"){
                    this.items.push({
                        name:data.tenantName,
                        id: data.tenantId,
                        checked:false
                    })
                }
            }else{
                if(data.status == "ACTIVE"){
                    this.items.push({
                        name:data.tenantName,
                        id: data.tenantId,
                        checked:false
                    })
                }
            }
            this.filteredItems = this.items;
        });
      }
    );
  }


  selectAll(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.items.forEach(item => item.checked = isChecked);
  }
  updateSelectAllState() {
    const allChecked = this.items.every(item => item.checked);
    const noneChecked = this.items.every(item => !item.checked);
  }

  filterItems() {
    const searchTerm = this.searchText?.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.label?.toLowerCase().includes(searchTerm)
    );
  }


  areAllChecked(): boolean {
    return this.items.length > 0 && this.items.every(item => item.checked);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    let tenants = []
    this.filteredItems.forEach((ele) => {
        if(ele.checked){
            tenants.push(ele.id);
        }
    })
    const payload = {
        "event": {
            "eventData": {
                "id": this.id,
                "tenants": tenants
            },
            "eventType": "USER",
            "eventSubType": this.title == 'In Active Tenants' ? "ACTIVATE" : "DEACTIVATE"
        }
    }
    this.dataService.updateTenantsStatusBySA(payload).subscribe(res => {
    this.dialogRef.close(true);
    })
  }

}
