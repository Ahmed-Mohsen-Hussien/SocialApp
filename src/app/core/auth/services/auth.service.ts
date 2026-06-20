import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { UserDataResponse } from '../models/user-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  decoded: any = null;
  sendRegisterData(userData: object): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(environment.base_url + 'users/signup', userData);
  }
  sendLoginData(userData: object): Observable<UserDataResponse> {
    return this.httpClient.post<UserDataResponse>(environment.base_url + 'users/signin', userData);
  }
  changePassword(data: object): Observable<any> {
    return this.httpClient.patch(environment.base_url + 'users/change-password', data);
  }
  signOut(): void {
    localStorage.removeItem('userToken');
    this.router.navigate(['/login']);
  }
  decodeUserToken(): any {
    const token = localStorage.getItem('userToken');
    if (token) {
      this.decoded = jwtDecode(token);
    }
    return this.decoded;
  }
}
