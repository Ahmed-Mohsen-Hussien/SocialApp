import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Notification, NotificationsDataResponse } from '../../models/notifications-data.interface';
import { SingleNotificationDataResponse } from '../../../shared/components/single-notification/models/single-notification-data.interface';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private readonly httpClient = inject(HttpClient);
  unreadCount: WritableSignal<number> = signal<number>(0);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  allNotificationsList: WritableSignal<Notification[]> = signal<Notification[]>([]);
  unreadNotificationsList: WritableSignal<Notification[]> = signal<Notification[]>([]);
  getAllNotifications(page: number = 1, limit: number = 30): Observable<NotificationsDataResponse> {
    return this.httpClient.get<NotificationsDataResponse>(
      environment.base_url + `notifications?page=${page}&limit=${limit}`,
    );
  }
  getUnreadNotifications(
    page: number = 1,
    limit: number = 30,
  ): Observable<NotificationsDataResponse> {
    return this.httpClient.get<NotificationsDataResponse>(
      environment.base_url + `notifications?unread=false&page=${page}&limit=${limit}`,
    );
  }
  getUnreadCount(): Observable<any> {
    return this.httpClient.get<any>(environment.base_url + `notifications/unread-count`);
  }
  markAsRead(notificationId: string): Observable<SingleNotificationDataResponse> {
    return this.httpClient.patch<SingleNotificationDataResponse>(
      environment.base_url + `notifications/${notificationId}/read`,
      {},
    );
  }
  markAllAsRead(): Observable<any> {
    return this.httpClient.patch<any>(environment.base_url + 'notifications/read-all', {});
  }
}
