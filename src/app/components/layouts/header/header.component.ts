import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    welcome: string;
    email: string;

    constructor(private router: Router) { }

    ngOnInit() {
      this.welcome = localStorage.getItem('User Name')
      this.email = localStorage.getItem('Email')
    }

    logout(): void {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('SA');
      this.router.navigate(['/login']);
    }
}
