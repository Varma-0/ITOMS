import { Component, HostBinding, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class LandingComponent implements OnInit {
  title = 'zero';
  index = 0;
  titles = ['zero', 'multi', 'firm', 'device', 'remote', 'custom'];
  intervalId: any;
  showArrows = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.showArrows = event.target.innerWidth <= 768;
    this.handleAutoChange()
  }

  constructor() {}

  ngOnInit() {
    this.onResize({ target: { innerWidth: window.innerWidth } });

  }

  handleAutoChange() {
    if(this.showArrows) {
     this.intervalId = setInterval(() => {
        this.index = this.index === 5 ? 0 : this.index + 1;
        this.title = this.titles[this.index];
      }, 5000);
    } else {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      this.index = 0;
      this.title = this.titles[this.index];
    }
  }

  titleChange(name) {
    this.title = name;
  }

  previousSlide() {
    this.index = this.index === 0 ? 5 : this.index - 1;
    this.title = this.titles[this.index];
  }

  nextSlide() {
    this.index = this.index === 5 ? 0 : this.index + 1;
    this.title = this.titles[this.index];
  }
}
