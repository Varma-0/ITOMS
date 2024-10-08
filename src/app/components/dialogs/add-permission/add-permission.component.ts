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
  tenantNames:any = [];
  roleNames:any = [];
  alertNames:any = [];
  title='';
  submitted = false;
  permissionForm: FormGroup;
  tenantForm: FormGroup;
  errorStyle = {
    'border-color':'red'
   }
  constructor(public dialogRef: MatDialogRef<AddPermissionComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices) {
    this.permissionOptionNames = data.permissionOptionNames;
    this.tenantNames = data.tenantNames;
    this.alertNames = data.alertNames;
    this.roleNames = data.roleNames;
    this.title = data.title;
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
      this.tenantForm = this.fb.group({
        tenant: ['',Validators.required],
        tenantName:[''],
        role: ['',Validators.required],
        roleName:[''],
        alert: [[],Validators.required],
        alerts:[[]]
      });
    }

    get tl(){
        return this.tenantForm.controls;
    }

    get pl(){
        return this.permissionForm.controls;
    }

    getObjectById(id,list) {
        return list.find(obj => obj.id === id);
    }
  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if(this.title != 'Role'){
        if (this.permissionForm.valid && (this.pl.checkbox1.value || this.pl.checkbox2.value || this.pl.checkbox3.value )) {
            this.permissionForm.get('name').setValue(this.getObjectById(this.permissionForm.get('permission').value,this.permissionOptionNames).name)
            this.dialogRef.close(this.permissionForm.value);
        }else{
            alert("Please check the data");
        }
    }else if(this.title == 'Role'){
        this.submitted = true;
        if(this.tenantForm.invalid){
            return;
        }
        this.tenantForm.get('tenantName').setValue(this.getObjectById(this.tenantForm.get('tenant').value,this.tenantNames).name)
        this.tenantForm.get('roleName').setValue(this.getObjectById(this.tenantForm.get('role').value,this.roleNames).name)
        this.tenantForm.get('alert').value.forEach(element => {
            this.tenantForm.get('alerts').value.push(
                {
                    'id':element,
                    'name': this.getObjectById(element,this.alertNames).name
                }
            )
        });
        this.dialogRef.close(this.tenantForm.value);
    }
  }

  change(){
    if (this.permissionForm.get('checkbox3').value == true) {
        this.permissionForm.get('checkbox2').setValue(true);
        this.permissionForm.get('checkbox1').setValue(true);
        this.permissionForm.updateValueAndValidity();
    }else if(this.permissionForm.get('checkbox2').value == true){
        this.permissionForm.get('checkbox1').setValue(true);
        this.permissionForm.updateValueAndValidity();
    }
  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
