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
  submitted = false;
  userData:any;
    isSAValue: boolean;
    errorStyle = {
     'border-color':'red'
    }
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
        tenant: [''],
        tenantName:[''],
        role:  [''],
        roleName:[''],
        alert: [''],
        alertName:[''],
        firstName: ['',Validators.required],
        lastName: ['',Validators.required],
        dob: ['',Validators.required],
        email: ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
        phone: ['',[Validators.required,Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
        country: ['',Validators.required],
        altemail: ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
        altphone: ['',[Validators.required,Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
        altcountry: ['',Validators.required],
        tenants:this.fb.array([]),
      });
      this.roleForm = this.fb.group({
        name: [''],
        description: [''],
        roles: this.fb.array([])
      });
      this.alertForm = this.fb.group({
        name: ['',Validators.required],
        originator: ['',Validators.required],
        alert: ['',Validators.required],
        template: ['',Validators.required],
        description: [''],
        checkbox1: [''],
        checkbox2: [''],
        checkbox3: [''],
        tvalue: [''],
        dvalue: ['',Validators.required],
        minvalue: ['',Validators.required],
        maxvalue: ['',Validators.required],
        templateId: ['',Validators.required],
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
        name: ['',Validators.required],
        description: [''],
        type: ['',Validators.required],
      });
      this.merchantForm = this.fb.group({
        name: [''],
        cname: [''],
        email: [''],
        phone: [''],
      });
      if(this.title == 'Edit User'){
        this.userForm.patchValue(this.userData.form);
        this.ul.firstName.disable()
        this.ul.lastName.disable()
      }else if(this.title == 'Edit Role'){
        this.roleForm.patchValue(this.userData.form);
        this.userData.form.roles?.forEach(roleData => {
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
      if (this.loginData != 'true') {
        this.ul.tenant.setValidators(Validators.required)
        this.ul.role.setValidators(Validators.required)
        this.ul.alert.setValidators(Validators.required)
      }else{
        this.ul.tenant.setValidators([])
        this.ul.role.setValidators([])
        this.ul.alert.setValidators([])
      }
  }

  applyValidation(){
    if (this.alertForm.get('checkbox1').value) {
        this.alertForm.get('tvalue').setValidators(Validators.required);
    }else{
        this.alertForm.get('tvalue').setValidators([]);
    }
    this.alertForm.get('tvalue').updateValueAndValidity();
  }

  get al(){
    return this.alertForm.controls;
  }

  get tl(){
    return this.tenantForm.controls;
  }

  get ul(){
    return this.userForm.controls;
  }

  get items(): FormArray {
    return this.roleForm.get('roles') as FormArray;
  }

  createItem(data): FormGroup {
    return this.fb.group({
      name: [data.name],
      id:[data.permission],
      allowView: [data.checkbox1],
      allowEdit: [data.checkbox2],
      allowDelete: [data.checkbox3]
    });
  }

  addItem(data): void {
    this.items.push(this.createItem(data));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  // removeTenant(index: number): void {
  //   this.userForm.get('tenants').value.removeAt(index);
  // }
  removeTenant(index: number): void {
    const tenantsArray = this.userForm.get('tenants') as FormArray;
    tenantsArray.removeAt(index);
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

  openTenantDialog(): void {
    const dialogRef = this.dialog.open(AddPermissionComponent, {
      data: {
        tenantNames: this.tenantOptionNames,
        alertNames: this.alertOptionNames,
        roleNames: this.roleOptionNames,
        title: 'Role',
      },
      width: '40%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const tenantsArray = this.userForm.get('tenants') as FormArray;
        tenantsArray.push(
          this.fb.group({
            tenant: {
              id: result.tenant,
              name: result.tenantName,
            },
            role: {
              id: result.role,
              name: result.roleName,
            },
            alerts: this.fb.array(result.alerts),
          })
        );
      }
    });
  }


  getObjectById(id,list) {
    return list.find(obj => obj.id === id);
}

  onCancel(): void {
    this.dialogRef.close(false);
  }
  onConfirm(): void {
    if(this.title == 'Add User' || this.title == 'Edit User'){
        this.submitted = true;
        if(this.userForm.invalid){
            return;
        }
        if(this.loginData != 'true'){
            this.userForm.get('tenantName').setValue(this.getObjectById(this.userForm.get('tenant').value,this.tenantOptionNames).name)
        this.userForm.get('roleName').setValue(this.getObjectById(this.userForm.get('role').value,this.roleOptionNames).name)
        this.userForm.get('alertName').setValue(this.getObjectById(this.userForm.get('alert').value,this.alertOptionNames).name)
        }
        this.dialogRef.close(this.userForm.value);
      }else if(this.title == 'Add Role' || this.title == 'Edit Role'){
        this.dialogRef.close({
            data:this.roleForm.value,
            roles: this.items.value
        });
      }else if(this.title == 'Add Alert' || this.title == 'Edit Alert'){
        this.submitted = true;
        if(this.alertForm.invalid){
            return;
        }
        this.dialogRef.close(this.alertForm.value);
      }else if(this.title == 'Add Permission' || this.title == 'Edit Permission'){
        this.dialogRef.close(this.permissionForm.value);
      }else if(this.title == 'Add Tenant' || this.title == 'Edit Tenant'){
        this.submitted = true;
        if(this.tenantForm.invalid){
            return;
        }
        this.dialogRef.close(this.tenantForm.value);
      }else if(this.title == 'Add Merchant' || this.title == 'Edit Merchant'){
        this.dialogRef.close(this.merchantForm.value);
      }

  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
