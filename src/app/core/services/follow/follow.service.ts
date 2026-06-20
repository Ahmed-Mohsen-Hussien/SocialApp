import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  private readonly httpClient = inject(HttpClient);
  followUser(userId: string): Observable<any> {
    return this.httpClient.put(environment.base_url + `/users/${userId}/follow`, {});
  }
}
