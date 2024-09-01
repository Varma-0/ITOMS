

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { terminalBody } from './body/body';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {
    
    private httpHeaders: HttpHeaders;

    constructor(private http: HttpClient) {
        let token = localStorage.getItem('jwtToken');
        this.httpHeaders = new HttpHeaders()
            .set('Authorization', `${token}`);
    }

    terminalData(options: terminalBody): Observable<any> {
        return this.http.post<any>(`${environment.tmsApiUrl}/tms/device/search`, options, { headers: this.httpHeaders });
    }

    merchantData(options:terminalBody): Observable<any> {
        return this.http.post<any>(`${environment.userApiUrl}/merchant/getTenantMerchants`,options)
    }

    userData(): Observable<any> {
        return this.http.get<any>(`${environment.userApiUrl}/user/getTenantUsers`, {headers: this.httpHeaders});
    }

    roleData(): Observable<any> {
        return this.http.get<any>(`${environment.userApiUrl}/role/`, {headers: this.httpHeaders});
    }

    alertData(): Observable<any> {
        return this.http.get<any>(`${environment.userApiUrl}/alert/`, {headers: this.httpHeaders});
    }

    permissionData(): Observable<any> {
        return this.http.get<any>(`${environment.userApiUrl}/permission/getTenantPermissions`, {headers: this.httpHeaders});
    }

    tenantData(): Observable<any> {
        return this.http.get<any>(`${environment.userApiUrl}/tenant/`, {headers: this.httpHeaders});
    }
}
