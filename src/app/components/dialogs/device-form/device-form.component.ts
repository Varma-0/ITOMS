import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { midHeirarchy } from 'src/app/services/login/body/body';
import { midEvent } from 'src/app/services/login/body/event';
import { midDevice } from 'src/app/services/login/body/event-data';
import { SharedServices } from 'src/app/services/shared.service';
import { TerminalService } from 'src/app/services/terminal/devicelist';
import { HierarchySelectionComponent } from '../hierarchy-selection/hierarchy-selection.component';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss'],
})
export class DevicesFormComponent {
  title = '';
  deviceForm: FormGroup;
  modalForm: FormGroup;
  options:'';
  status = 'ACTIVE';
  modals = [];
  merchants = [];
  hirearchies = [];
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<DevicesFormComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices,private dataService: TerminalService) {
    this.title = data.title
    this.options = data.hierarchy
    console.log("gvbx",this.options);
    this.modals = data.modals
    console.log("iugd",this.modals);
    this.merchants = data.merchants
    this.shared.setSidebarState(false);
  }

  ngOnInit(){
    this.deviceForm = this.fb.group({
        sno: [''],
        skey: [''],
        modal: [''],
        merchant : [''],
        hierarchy: [''],
        status:this.status,
        merchantName:[''],
        modalName : [''],
        hierarchyName :[''],
      });
      this.modalForm = this.fb.group({
        name: [''],
        oem: [''],
        description: [''],
      });
      if(this.title == 'Edit Device'){
        this.deviceForm.patchValue(this.data.form);
        this.getHierarchy();
      }else if(this.title == 'Edit Model'){
        this.modalForm.patchValue(this.data.form);
      }
  }

  getHierarchy(){
    const merchantId = new midDevice(this.deviceForm.get('merchant').value);
    const merchantEvent = new midEvent(merchantId,'HIERARCHY','SEARCH');
    const mrHierarchy = new midHeirarchy(merchantEvent);
    this.dataService.getHierarchyFromMerchant(mrHierarchy).subscribe(
      response =>  {
        response.event.eventData.forEach(name => {
          this.hirearchies.push({
            id:name.id,
            name : name.name
          })
        });;
      }
    )
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if(this.title == 'Add Device' || this.title == 'Edit Device') {
      this.deviceForm.get('modalName').setValue(this.getObjectById(this.deviceForm.get('modal').value,this.modals).name)
      this.deviceForm.get('merchantName').setValue(this.getObjectById(this.deviceForm.get('merchant').value,this.merchants).name)
      this.deviceForm.get('hierarchyName').setValue(this.deviceForm.get('hierarchy').value,this.hirearchies);
      this.dialogRef.close(this.deviceForm.value);
    } else {
      this.dialogRef.close(this.modalForm.value);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(HierarchySelectionComponent,{
        data : {
            title : 'Select Hierarchy',
            list : JSON.parse(localStorage.getItem('Hlist'))
        },
        width:'50%',
    });
    dialogRef.afterClosed().subscribe(result => {
        this.deviceForm.get('hierarchy').setValue(result);
    });
  }

   getObjectById(id,list) {
    return list.find(obj => obj.id === id);
}

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
