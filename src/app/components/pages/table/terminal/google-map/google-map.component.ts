import { Component, AfterViewInit, Input } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { SharedServices } from 'src/app/services/shared.service';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements AfterViewInit {
  @Input() latitude: number;
  @Input() longitude: number;

  constructor(private shared:SharedServices){}

  ngAfterViewInit(): void {
    this.shared.latlong.subscribe(res => {
        this.latitude = Number(res.lat),
        this.longitude = Number(res.long),
        this.loadMap();
    })
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
