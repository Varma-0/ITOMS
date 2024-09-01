import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

export class SharedServices{
    private sidebarActive = new BehaviorSubject<boolean>(true);

    // Observable to expose sidebar state
    sidebarActive$ = this.sidebarActive.asObservable();

    // Method to set the sidebar state
    setSidebarState(active: boolean): void {
      this.sidebarActive.next(active);
    }
    constructor(){}

}
