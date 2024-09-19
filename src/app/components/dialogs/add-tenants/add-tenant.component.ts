import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-tenant',
  templateUrl: './add-tenant.component.html',
  styleUrls: ['./add-tenant.component.scss'],
})
export class AddTenantComponent {
  permissionOptionNames:any = [];
  permissionForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddTenantComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices) {
    this.permissionOptionNames = data.permissionOptionNames;
    this.shared.setSidebarState(false);
  }

  ngOnInit(){
      this.permissionForm = this.fb.group({
        tenant: ['',Validators.required],
        role:['',Validators.required],
        alert: [[],Validators.required],
      });
    }

    getObjectById(id,list) {
        return list.find(obj => obj.id === id);
    }
  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (this.permissionForm.valid) {
        this.permissionForm.get('name').setValue(this.getObjectById(this.permissionForm.get('permission').value,this.permissionOptionNames).name)
        this.dialogRef.close(this.permissionForm.value);
    }
  }

  change(){
    if (this.permissionForm.get('checkbox3').value == true) {
        this.permissionForm.get('checkbox2').setValue(true);
        this.permissionForm.get('checkbox1').setValue(true);
        this.permissionForm.updateValueAndValidity();
    }
  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
