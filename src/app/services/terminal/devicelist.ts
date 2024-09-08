

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { terminalBody } from './body/body';
import { environment } from 'src/environments/environment';
import { createModelEvent, deleteModelEvent, midEvent, updateModelEvent } from '../login/body/event';
import { addDeviceBody, createBody, createUser, deleteBody, midHeirarchy, updateBody, updateDevice } from '../login/body/body';
import { midDevice, addDevice } from '../login/body/event-data';

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

    deleteModel(options:deleteBody): Observable<any> {
        return this.http.patch<any>(`${environment.tmsApiUrl}/tms/model/delete`, options, { headers: this.httpHeaders });
    }

    deleteDevice(options:deleteBody): Observable<any> {
        return this.http.post<any>(`${environment.tmsApiUrl}/tms/device/delete`, options, { headers: this.httpHeaders });
    }

    updateModel(options:updateBody): Observable<any> {
        return this.http.put<any>(`${environment.tmsApiUrl}/tms/model`, options, { headers: this.httpHeaders });
    }

    updateDevice(options:updateDevice): Observable<any> {
        return this.http.put<any>(`${environment.tmsApiUrl}/tms/device/update`, options, { headers: this.httpHeaders });

    }

    getHierarchyFromMerchant(options: midHeirarchy):Observable<any> {
        return this.http.post<any>(`${environment.userApiUrl}/hierarchy/search`, options, { headers: this.httpHeaders });
    }

    createModel(options:createBody): Observable<any> {
        return this.http.post<any>(`${environment.tmsApiUrl}/tms/model`, options, { headers: this.httpHeaders });
    }

    editUser(options:createUser): Observable<any> {
        return this.http.post<any>(`${environment.userApiUrl}/user/getUser`,options, {headers: this.httpHeaders});
    }

    addNewDevice(options: addDeviceBody): Observable<any> {
        return this.http.post(`${environment.tmsApiUrl}/tms/device`,options, { headers: this.httpHeaders});
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
