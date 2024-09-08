

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { terminalBody } from './body/body';
import { environment } from 'src/environments/environment';
import { createModelEvent, createNewUserBody, deleteModelEvent, midEvent, updateModelEvent, updateRoleBody } from '../login/body/event';
import { addDeviceBody, createBody, createNewUser, createUser, deleteBody, merchantAdd, merchantDelete, midHeirarchy, permissionAdd, permissionDelete, permissionUpdate, roleAdd, roleUpdate, tenantAdd, tenantDelete, tenantUpdate, updateBody, updateDevice } from '../login/body/body';
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

    updatePermission(options:permissionUpdate): Observable<any> {
        return this.http.put<any>(`${environment.userApiUrl}/permission/`, options, { headers: this.httpHeaders });
    }

    deletePermission(options:permissionDelete): Observable<any> {
        return this.http.patch<any>(`${environment.userApiUrl}/permission/`, options, { headers: this.httpHeaders });
    }

    addPermission(options:permissionAdd): Observable<any> {
        return this.http.post<any>(`${environment.userApiUrl}/permission/`, options, { headers: this.httpHeaders });
    }

    updateTenant(options:tenantUpdate): Observable<any> {
        return this.http.put<any>(`${environment.userApiUrl}/tenant/`, options, { headers: this.httpHeaders });
    }

    deleteTenant(options:tenantDelete): Observable<any> {
        return this.http.patch<any>(`${environment.userApiUrl}/tenant/`, options, { headers: this.httpHeaders });
    }

    addTenant(options:tenantAdd): Observable<any> {
        return this.http.post<any>(`${environment.userApiUrl}/tenant/`, options, { headers: this.httpHeaders });
    }

    addMerchant(options:merchantAdd): Observable<any> {
        return this.http.post<any>(`${environment.tmsApiUrl}/tms/merchant/add`, options, { headers: this.httpHeaders });
    }

    deleteMerchant(options:merchantDelete): Observable<any> {
        return this.http.post<any>(`${environment.tmsApiUrl}/tms/merchant/delete`, options, { headers: this.httpHeaders });
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
        return this.http.post<any>(`${environment.tmsApiUrl}/tms/merchant/getTenantMerchants`,options)
    }

    addNewUser(options: createNewUser): Observable<any> {
        return this.http.post<any>(`${environment.userApiUrl}/user/`,options, {headers: this.httpHeaders});
    }

    updateRoles(options: roleUpdate): Observable<any> {
        return this.http.put<any>(`${environment.userApiUrl}/role/`,options, {headers: this.httpHeaders});
    }

    addRoles(options: roleAdd): Observable<any> {
        return this.http.post<any>(`${environment.userApiUrl}/role/`,options, {headers: this.httpHeaders});
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
