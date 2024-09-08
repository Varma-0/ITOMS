import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-permission',
  templateUrl: './add-permission.component.html',
  styleUrls: ['./add-permission.component.scss'],
})
export class AddPermissionComponent {
  permissionOptionNames:any = [];
  permissionForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddPermissionComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices) {
    this.permissionOptionNames = data.permissionOptionNames;
    this.shared.setSidebarState(false);
  }

  ngOnInit(){
      this.permissionForm = this.fb.group({
        permission: ['',Validators.required],
        name:[''],
        checkbox1: [false],
        checkbox2: [false],
        checkbox3: [false],
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
