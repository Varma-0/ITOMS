import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })

export class SharedServices{
    private sidebarActive = new BehaviorSubject<boolean>(true);
    showLoader = new BehaviorSubject<boolean>(false);
    private loginData: any;
    modelsList=[];

    // Observable to expose sidebar state
    sidebarActive$ = this.sidebarActive.asObservable();

    // Method to set the sidebar state
    setSidebarState(active: boolean): void {
      this.sidebarActive.next(active);
    }
    constructor(private toastr: ToastrService){}

    showSuccess(msg){
        this.toastr.success(msg, 'Hurray');
    }

    showError(msg) {
      this.toastr.error(msg, 'Error');
    }

    setLoginData(data: any) {
      this.loginData = data;
    }

    getLoginData() {
      return this.loginData;
    }

}
