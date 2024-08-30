

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
}
