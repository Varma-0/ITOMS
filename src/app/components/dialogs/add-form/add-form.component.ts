import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss'],
})
export class AddFormComponent {
  title = '';
  loginData:any;
  tenantOptionNames:any = [];
  roleOptionNames:any = [];
  alertOptionNames:any = [];
  permissionOptionNames:any = [];
  selectedTenants!: [];
  userForm: FormGroup;
  roleForm: FormGroup;
  alertForm: FormGroup;
  permissionForm: FormGroup;
  tenantForm: FormGroup;
  merchantForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddFormComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices) {
    this.title = data.title
    this.tenantOptionNames = data.tenantOptionNames
    this.roleOptionNames = data.roleOptionNames;
    this.alertOptionNames = data.alertOptionNames;
    this.permissionOptionNames = data.permissionOptionNames;
    this.shared.setSidebarState(false);
  }

  ngOnInit(){
    this.loginData = localStorage.getItem("SA");
    const isSAValue = localStorage.getItem('SA') === 'true';
    this.userForm = this.fb.group({
        tenant: [[]],
        role: isSAValue ? [[]] : [''],
        alert: isSAValue ? [[]] : [''],
        firstName: [''],
        lastName: [''],
        dob: [''],
        email: [''],
        phone: [''],
        country: [''],
        altemail: [''],
        altphone: [''],
        altcountry: [''],
      });
      this.roleForm = this.fb.group({
        name: [''],
        description: [''],
        permission: isSAValue ? [[]] : [''],
        checkbox1: [''],
        checkbox2: [''],
        checkbox3: [''],
      });
      this.alertForm = this.fb.group({
        name: [''],
        originator: [''],
        alert: [''],
        template: [''],
        description: [''],
        checkbox1: [''],
        checkbox2: [''],
        checkbox3: [''],
        tvalue: [''],
        dvalue: [''],
        minvalue: [''],
        maxvalue: [''],
        templateId: [''],
      });
      this.permissionForm = this.fb.group({
        name: [''],
        description: [''],
        permission: [''],
        checkbox1: [''],
        checkbox2: [''],
        checkbox3: [''],
      });
      this.tenantForm = this.fb.group({
        name: [''],
        description: [''],
        type: [''],
        stype: [''],
      });
      this.merchantForm = this.fb.group({
        name: [''],
        cname: [''],
        email: [''],
        phone: [''],
      });
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
