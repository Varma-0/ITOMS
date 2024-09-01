import { Component } from "@angular/core";

@Component({
 selector: 'app-profile',
 templateUrl : './profile.component.html',
 styleUrls:['./profile.component.scss']
})

export class ProfileComponent {
    parameter = {
        label: 'string',
        key: 'string',
        type: 'string',
        defaultValue: '',
        maxLength: 255,
        mandatory: false,
      };
    constructor(){}
    ngOnIt(){}
}
