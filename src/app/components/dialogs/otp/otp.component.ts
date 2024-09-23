import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { SharedServices } from 'src/app/services/shared.service';
import { PasswordComponent } from '../password/password.component';
import { emailBody, passBody } from 'src/app/services/login/body/body';
import { emailEvent, passEvent } from 'src/app/services/login/body/event';
import { passData, verifyEmailData } from 'src/app/services/login/body/event-data';
import { AuthService } from 'src/app/services/login/login';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent {
  submitted = false;
  otpForm: FormGroup;
  email;
  id;
  errorStyle = {
    'border-color':'red'
   }
  constructor(private authService: AuthService,public dialog: MatDialog,public dialogRef: MatDialogRef<OtpComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private fb:FormBuilder,private shared:SharedServices) {
    this.shared.setSidebarState(false);
    this.email = data.email;
  }

  ngOnInit(){
      this.otpForm = this.fb.group({
        otp: ['',Validators.required],
      });
    }

    get otpFor(){
        return this.otpForm.controls;
    }

    openPasswordDialog() {
        const dialogRef = this.dialog.open(PasswordComponent, {
            data: {

            },
            width: '60%'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.setPassword(result);
            }
        });
    }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.submitted = true;
    if(this.otpForm.invalid){
        return;
    }
    this.verifyOtp();
  }

  verifyOtp(){
    const eventData = new verifyEmailData(this.email,this.otpFor.otp.value,'EMAIL');
    console.log(eventData)
    const event = new emailEvent(eventData, 'USER', 'VERIFY_OTP');
    const updatePassRequest = new emailBody(event);
    this.authService.otpConfirmationforPassReset(updatePassRequest).subscribe(
      response => {
        if(response.status == 200) {
          this.shared.showSuccess("Otp Validated Successfully");
          this.id = response.event.eventData.uid;
          this.openPasswordDialog();
        }
      },
      error => {
      }
    );
  }

  setPassword(data){
    const eventData = new passData(this.id,data.password);
    console.log(eventData)
    const event = new passEvent(eventData, 'USER', 'CRD_RESET');
    const updatePassRequest = new passBody(event);
    this.authService.resetPass(updatePassRequest).subscribe(
      response => {
        if(response.status == 200) {
          this.dialogRef.close(true);
          this.shared.showSuccess("Password change successful! You're all set.")
        }
      },
      error => {
        this.dialogRef.close(true);
      }
    );
  }

  ngOnDestroy(){
    this.shared.setSidebarState(true);
  }
}
