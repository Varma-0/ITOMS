import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { dropBody, emailBody, passBody } from './body/body';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  emailChecklogin(options: emailBody): Observable<any> {
    return this.http.post<any>(`${environment.userApiUrl}/login/validate`, options);
  }

  loginWithPassword(options: passBody): Observable<any>  {
    return this.http.post<any>(`${environment.userApiUrl}/login/authenticate`, options);
  }

  loginWithOption(options: dropBody): Observable<any>  {
    return this.http.post<any>(`${environment.userApiUrl}/login/token`, options);
  }

  emailVerificationforPassReset(options: emailBody): Observable<any> {
    return this.http.post<any>(`${environment.userApiUrl}/cred/forgotCred`, options);
  }

  otpConfirmationforPassReset(options: emailBody): Observable<any> {
    return this.http.post<any>(`${environment.userApiUrl}/cred/verifyEmailOtp`, options);
  }

  resetPass(options: passBody): Observable<any> {
    return this.http.post<any>(`${environment.userApiUrl}/cred/reset`, options);
  }
}
