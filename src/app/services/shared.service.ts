import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, Observable } from "rxjs";

// Define an interface for latitude and longitude data
interface LatLong {
  lat: string;
  long: string;
}

@Injectable({
  providedIn: 'root'
})
export class SharedServices {
  private sidebarActive = new BehaviorSubject<boolean>(true);  // Sidebar state
  latlong = new BehaviorSubject<LatLong>({ lat: '', long: '' });  // Latitude and longitude data
  private eventDataSubject = new BehaviorSubject<any>({});  // General event data
  showLoader = new BehaviorSubject<boolean>(false);  // Loader visibility
  private loginData: any;  // Stores login data
  terminalViweData:any;
  modelsList: any[] = [];  // List to store models data

  // Observable for components to subscribe to event data changes
  eventData$: Observable<any> = this.eventDataSubject.asObservable();

  constructor(private toastr: ToastrService) {}

  // Method to update event data
  setEventData(data: any): void {
    this.eventDataSubject.next(data);
  }

  // Method to retrieve the latest event data value
  getEventData(): any {
    return this.eventDataSubject.value;
  }

  // Observable to expose sidebar state
  sidebarActive$ = this.sidebarActive.asObservable();

  // Method to set the sidebar state
  setSidebarState(active: boolean): void {
    this.sidebarActive.next(active);
  }

  // Toastr notification methods
  showSuccess(msg: string): void {
    this.toastr.success(msg, 'Hurray');
  }

  showError(msg: string): void {
    this.toastr.error(msg, 'Error');
  }

  // Methods for managing login data
  setLoginData(data: any): void {
    this.loginData = data;
  }

  setTerminalViewData(data: any): void {
    this.terminalViweData = data;
  }

  getTerminalViewData() {
    return this.terminalViweData;
  }

  getLoginData(): any {
    return this.loginData;
  }
}
