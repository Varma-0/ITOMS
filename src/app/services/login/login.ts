import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { dropBody, emailBody, passBody } from './body/body';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://ec2-3-110-102-138.ap-south-1.compute.amazonaws.com:9008/api/ina'; 

  constructor(private http: HttpClient) {}

  emailChecklogin(options: emailBody): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/validate`, options);
  }

  loginWithPassword(options: passBody): Observable<any>  {
    return this.http.post<any>(`${this.apiUrl}/login/authenticate`, options);
  }

  loginWithOption(options: dropBody): Observable<any>  {
    return this.http.post<any>(`${this.apiUrl}/login/token`, options);
  }
}
