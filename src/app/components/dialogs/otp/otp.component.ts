import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent {
  submitted = false;
  otpForm: FormGroup;
  errorStyle = {
    'border-color':'red'
   }
  constructor(public dialogRef: MatDialogRef<OtpComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices) {
    this.shared.setSidebarState(false);
  }

  ngOnInit(){
      this.otpForm = this.fb.group({
        otp: ['',Validators.required],
      });
    }

    get otpFor(){
        return this.otpForm.controls;
    }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.submitted = true;
    this.dialogRef.close(true);
  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
