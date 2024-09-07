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
  modals: [];
  merchants: [];
  hirearchies = [];
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<DevicesFormComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices,private dataService: TerminalService) {
    this.title = data.title
    this.options = data.hierarchy
    this.modals = data.modals
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
      });
      this.modalForm = this.fb.group({
        name: [''],
        description: [''],
      });
      if(this.title == 'Edit Device'){
        this.deviceForm.patchValue(this.data.form);
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
          this.hirearchies.push(name.name)
        });;
      }
    )
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if(this.title == 'Add Device' || this.title == 'Edit Device') {
      this.dialogRef.close(this.deviceForm.value);
    } else {
      this.dialogRef.close(this.modalForm.value);
    }
  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
