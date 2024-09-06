import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-device-form',
  templateUrl: './device-form.component.html',
  styleUrls: ['./device-form.component.scss'],
})
export class DevicesFormComponent {
  title = '';
  deviceForm: FormGroup;
  modalForm: FormGroup;
  options:[];
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<DevicesFormComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices) {
    this.title = data.title
    this.options = data.hierarchy
    this.shared.setSidebarState(false);
  }

  ngOnInit(){
    this.deviceForm = this.fb.group({
        sno: [''],
        skey: [''],
        modal: [''],
        hierarchy: [''],
      });
      this.modalForm = this.fb.group({
        name: [''],
        description: [''],
      });
      if(this.title == 'Edit Device'){
        this.deviceForm.patchValue(this.data.form);
      }else if(this.title == 'Edit Modal'){
        this.modalForm.patchValue(this.data.form);
      }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
