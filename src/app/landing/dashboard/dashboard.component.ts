import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class LandingComponent implements OnInit {
  title = 'zero'
  constructor() { }

  ngOnInit() {
  }

  titleChange(name){
    this.title = name;
  }

}
