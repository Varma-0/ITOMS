import { Component, Input, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  template: '<div id="map" style="height: 100%; width: 100%;"></div>',
  styles: [':host { display: block; height: 100%; width: 100%; }']
})
export class MapComponent implements AfterViewInit {
  @Input() latitude: number = 28.592294;
  @Input() longitude: number = 76.992886;
  private map: L.Map | undefined;

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([this.latitude, this.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([this.latitude, this.longitude]).addTo(this.map);
  }
}