import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';
import { AddPermissionComponent } from '../add-permission/add-permission.component';

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
  form: FormGroup;
  userData:any;
    isSAValue: boolean;
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<AddFormComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices) {
    this.title = data.title
    this.tenantOptionNames = data.tenantOptionNames
    this.roleOptionNames = data.roleOptionNames;
    this.alertOptionNames = data.alertOptionNames;
    this.permissionOptionNames = data.permissionOptionNames;
    this.shared.setSidebarState(false);
    this.userData = data;
  }

  ngOnInit(){
    this.loginData = localStorage.getItem("SA");
    this.isSAValue = localStorage.getItem('SA') === 'true';
    this.form = this.fb.group({
        items: this.fb.array([])
      });
    this.userForm = this.fb.group({
        tenant: [[]],
        role: this.isSAValue ? [[]] : [''],
        alert: this.isSAValue ? [[]] : [''],
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
        roles: this.fb.array([])
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
      if(this.title == 'Edit User'){
        this.userForm.patchValue(this.userData.form);
      }else if(this.title == 'Edit Role'){
        this.roleForm.patchValue(this.userData.form);
        this.userData.form.roles.forEach(roleData => {
            this.items.push(this.fb.group({
                label : roleData.label,
                view : [{value : roleData.view,disabled:true}],
                edit : [{value : roleData.edit,disabled:true}],
                delete : [{value : roleData.delete,disabled:true}]
            }));
          });
      }else if(this.title == 'Edit Alert'){
        this.alertForm.patchValue(this.userData.form);
      }else if(this.title == 'Edit Permission'){
        this.permissionForm.patchValue(this.userData.form);
      }else if(this.title == 'Edit Tenant'){
        this.tenantForm.patchValue(this.userData.form);
      }else if(this.title == 'Edit Merchant'){
        this.merchantForm.patchValue(this.userData.form);
      }
  }

  get items(): FormArray {
    return this.roleForm.get('roles') as FormArray;
  }

  createItem(data): FormGroup {
    return this.fb.group({
      label: [data.permission],
      view: [{value : data.checkbox1, disabled:true}],
      edit: [{value : data.checkbox2, disabled:true}],
      delete: [{value : data.checkbox3, disabled:true}]
    });
  }

  addItem(data): void {
    this.items.push(this.createItem(data));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddPermissionComponent,{
        data : {
            permissionOptionNames : this.permissionOptionNames
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != true && result != false) {
        this.addItem(result);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
  onConfirm(): void {
    if(this.title == 'Add User' || this.title == 'Edit User'){
        this.dialogRef.close(this.userForm.value);
      }else if(this.title == 'Add Role' || this.title == 'Edit Role'){
        this.dialogRef.close(this.roleForm.value);
      }else if(this.title == 'Add Alert' || this.title == 'Edit Alert'){
        this.dialogRef.close(this.alertForm.value);
      }else if(this.title == 'Add Permission' || this.title == 'Edit Permission'){
        this.dialogRef.close(this.permissionForm.value);
      }else if(this.title == 'Add Tenant' || this.title == 'Edit Tenant'){
        this.dialogRef.close(this.tenantForm.value);
      }else if(this.title == 'Add Merchant' || this.title == 'Edit Merchant'){
        this.dialogRef.close(this.merchantForm.value);
      }

  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
