import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-terminal-view',
  templateUrl: './terminal-view.component.html',
  styleUrl: './terminal-view.component.scss'
})
export class TerminalViewComponent {
  @Input() device: any;
  @Input() view: any;
  @Input() insideview: any;
  @Output() viewChange = new EventEmitter<boolean>();
  @Output() insideviewChange = new EventEmitter<boolean>();
  selectedTab: string = 'overview';
  toggleText: string = 'Off';
  cards = [
    { header: 'Storage', percentage: 60,icon:'file_present' },
    { header: 'Modules', percentage: 70,icon:'view_module' },
    { header: 'Traffic', percentage: 50,icon:'traffic' },
    { header: 'Battery', percentage: 80,icon:'battery_4_bar' }
  ];

  toggleView() {
    this.view = !this.view;
    this.insideview = !this.insideview;
    this.viewChange.emit(this.view);
    this.insideviewChange.emit(this.insideview);
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  abc() {
    console.log("wfwq")
  }

  onToggleChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.toggleText = isChecked ? 'On' : 'Off';
    console.log('Toggle switch state:', this.toggleText);
  }
}
