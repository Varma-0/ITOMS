import { Component, Input, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  template: `<div class="map-container"></div>`,
  styles: [
    `
      .map-container {
        height: 100%;
        width: 100%;
        border-radius: 10px;
      }
    `,
  ],
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() coordinates: [number, number];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const map = L.map(this.el.nativeElement.querySelector('.map-container'), {
      center: this.coordinates,
      zoom: 13,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      touchZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker(this.coordinates).addTo(map);
  }
}
