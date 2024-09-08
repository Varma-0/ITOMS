import { Component, AfterViewInit, Input } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements AfterViewInit {
  @Input() latitude: number = 28.592294;
  @Input() longitude: number = 76.992886;

  ngAfterViewInit(): void {
    this.loadMap();
  }

  loadMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 15
    };

    const map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);

    new google.maps.Marker({
      position: { lat: this.latitude, lng: this.longitude },
      map: map,
      title: 'Location'
    });
  }
}
