import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfilesComponent implements OnInit {

  profileForm: FormGroup;
  initials: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      firstName: ['Sandeep', Validators.required],
      lastName: ['Reddy', Validators.required],
      dob: ['2000-08-31', Validators.required],
      email: ['sandeepreddymukku444@gmail.com', [Validators.required, Validators.email]],
      phone: ['7997429887', Validators.required],
      country: ['IND', Validators.required],
      emailAlt: ['sandeepreddymukku777@gmail.com', Validators.email],
      phoneAlt: ['7766998853'],
      countryAlt: ['US']
    });

    this.updateInitials();
    this.profileForm.valueChanges.subscribe(() => this.updateInitials());
  }

  updateInitials() {
    const firstName = this.profileForm.get('firstName').value;
    const lastName = this.profileForm.get('lastName').value;
    this.initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      // Here you would typically send the form data to your backend
    }
  }

}
