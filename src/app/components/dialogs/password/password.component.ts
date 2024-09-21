import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent {
  submitted = false;
  passwordForm: FormGroup;
  errorStyle = {
    'border-color':'red'
   }
  constructor(public dialogRef: MatDialogRef<PasswordComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices) {
    this.shared.setSidebarState(false);
  }

  ngOnInit(){
      this.passwordForm = this.fb.group({
        password: ['',Validators.required],
        cpassword: ['',Validators.required]
      });
    }

    get pForm(){
        return this.passwordForm.controls;
    }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.submitted = true;
    if(this.pForm.invalid || this.pForm.password.value != this.pForm.cpassword.value){
        return;
    }
    this.dialogRef.close(this.passwordForm.value);
  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
