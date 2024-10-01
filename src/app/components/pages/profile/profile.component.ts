import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedServices } from 'src/app/services/shared.service';
import { TerminalService } from 'src/app/services/terminal/devicelist';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfilesComponent implements OnInit {
  profileForm: FormGroup;
  initials: string = 'N/A';
  uid: any;

  constructor(
    private fb: FormBuilder, 
    private dataService: TerminalService, 
    private shared: SharedServices
  ) {}

  ngOnInit() {
    this.uid = localStorage.getItem('uid');
    this.shared.showLoader.next(true);

    // Initialize the form with default 'N/A' values
    this.profileForm = this.fb.group({
      firstName: ['N/A', Validators.required],
      lastName: ['N/A', Validators.required],
      dob: ['N/A', Validators.required],
      email: ['N/A', [Validators.required, Validators.email]],
      phone: ['N/A', Validators.required],
      country: ['N/A', Validators.required],
      emailAlt: ['N/A', Validators.email],
      phoneAlt: ['N/A'],
      countryAlt: ['N/A']
    });

    const payload = {
      "event": {
        "eventData": {
          "uid": this.uid
        },
        "eventType": "USER",
        "eventSubType": "SEARCH"
      }
    }

    this.dataService.getUserInfo(payload).subscribe(
      response => {
        if (response.status == 200) {
          const userDetails = response.event.eventData.userDetails;
          
          // Update form with user details, using 'N/A' for null values
          this.profileForm.patchValue({
            firstName: userDetails.firstName || 'N/A',
            lastName: userDetails.lastName || 'N/A',
            dob: userDetails.dob || 'N/A',
            email: userDetails.email || 'N/A',
            phone: userDetails.phone || 'N/A',
            country: userDetails.country || 'N/A',
            emailAlt: userDetails.emailAlt || 'N/A',
            phoneAlt: userDetails.phoneAlt || 'N/A',
            countryAlt: userDetails.countryAlt || 'N/A'
          });

          this.updateInitials();
        }
        this.shared.showLoader.next(false);
      },
      error => {
        this.shared.showError(error.message);
        console.error('Error:', error);
        this.shared.showLoader.next(false);
      }
    );

    this.profileForm.valueChanges.subscribe(() => this.updateInitials());
  }

  updateInitials() {
    const firstName = this.profileForm.get('firstName').value;
    const lastName = this.profileForm.get('lastName').value;
    
    if (firstName === 'N/A' || lastName === 'N/A') {
      this.initials = 'N/A';
    } else {
      this.initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      // Here you would typically send the form data to your backend
    }
  }
}