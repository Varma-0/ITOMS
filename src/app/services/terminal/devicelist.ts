

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { terminalBody } from './body/body';
import { environment } from 'src/environments/environment';
import { createModelEvent, deleteModelEvent, updateModelEvent } from '../login/body/event';
import { createBody } from '../login/body/body';

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

    modelData(options: terminalBody): Observable<any> {
        return this.http.post<any>(`${environment.tmsApiUrl}/tms/model/search`, options, { headers: this.httpHeaders });
    }

    deleteModel(options:deleteModelEvent): Observable<any> {
        return this.http.post<any>(`${environment.tmsApiUrl}/tms/model/delete`, options, { headers: this.httpHeaders });
    }

    updateModel(options:updateModelEvent): Observable<any> {
        return this.http.put<any>(`${environment.tmsApiUrl}/tms/model`, options);
    }

    createModel(options:createBody): Observable<any> {
        return this.http.post<any>(`${environment.tmsApiUrl}/tms/model`, options, { headers: this.httpHeaders });
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
