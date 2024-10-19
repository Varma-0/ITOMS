import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class LandingComponent implements OnInit {
  title = 'zero'
  index = 0;
  titles = ['zero','multi','firm','device','remote','custom']
  constructor() { }

  ngOnInit() {
    // setInterval(() => {
    //     this.index = this.index == 5 ? 0 : this.index+1;
    //     this.title = this.titles[this.index];
    //   }, 5000);
  }

  titleChange(name){
    this.title = name;
  }

  previousSlide() {
    this.index = this.index == 0 ? 5 : this.index -1;
    this.title = this.titles[this.index];
    }
    nextSlide() {
        this.index = this.index == 5 ? 0 : this.index+1;
        this.title = this.titles[this.index];
    }

}
