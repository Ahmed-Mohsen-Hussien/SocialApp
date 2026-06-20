import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { SuggestionsResponse } from '../../models/suggestions.interface';

@Injectable({
  providedIn: 'root',
})
export class SuggestionsService {
  private readonly httpClient = inject(HttpClient);
  getAllSuggestions(
    limit: number = 20,
    page: number = 1,
    name: string,
  ): Observable<SuggestionsResponse> {
    return this.httpClient.get<SuggestionsResponse>(
      environment.base_url + `/users/suggestions?limit=${limit}&page=${page}&q=${name}`,
    );
  }
}
