import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { MyProfileDataResponse } from '../../models/my-profile-data.interface';
import { UserProfileDataResponse } from '../../models/user-profile-data.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly httpClient = inject(HttpClient);
  getMyProfile(): Observable<MyProfileDataResponse> {
    return this.httpClient.get<MyProfileDataResponse>(environment.base_url + 'users/profile-data');
  }
  getUserProfile(userId: string | null): Observable<UserProfileDataResponse> {
    return this.httpClient.get<UserProfileDataResponse>(
      environment.base_url + `users/${userId}/profile`,
    );
  }
  uploadCoverImage(data: object): Observable<any> {
    return this.httpClient.put<any>(environment.base_url + `users/upload-cover`, data);
  }
  uploadProfileImage(data: object): Observable<any> {
    return this.httpClient.put<any>(environment.base_url + `users/upload-photo`, data);
  }
  removeCoverImage(): Observable<any> {
    return this.httpClient.delete<any>(environment.base_url + `users/cover`);
  }
}
