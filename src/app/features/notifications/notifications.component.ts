import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';

import { Notification } from '../../core/models/notifications-data.interface';
import { NotificationsService } from '../../core/services/notifications/notifications.service';
import { SingleNotificationComponent } from '../../shared/components/single-notification/single-notification.component';
import { PostLoadingComponent } from '../../shared/components/post-loading/post-loading.component';

@Component({
  selector: 'app-notifications',
  imports: [SingleNotificationComponent, PostLoadingComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationsService = inject(NotificationsService);
  allNotificationsList: Signal<Notification[]> = computed(() =>
    this.notificationsService.allNotificationsList(),
  );
  unreadNotificationsList: Signal<Notification[]> = computed(() =>
    this.notificationsService.unreadNotificationsList(),
  );
  unreadCount: Signal<number> = computed(() => this.notificationsService.unreadCount());
  buttonId: string | null = null;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  ngOnInit(): void {
    this.getMyNotifications();
    this.getMyUnreadNotifications();
    this.getUnreadNotificationsCount();
    this.buttonId = 'all';
  }
  getMyNotifications(): void {
    this.isLoading.set(true);
    this.notificationsService.getAllNotifications().subscribe({
      next: (res) => {
        this.isLoading.set(false);

        this.notificationsService.allNotificationsList.set(res.data.notifications);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
  getMyUnreadNotifications(): void {
    this.notificationsService.getUnreadNotifications().subscribe({
      next: (res) => {
        this.notificationsService.unreadNotificationsList.set(res.data.notifications);
      },
    });
  }
  getUnreadNotificationsCount(): void {
    this.notificationsService.getUnreadCount().subscribe({
      next: (res) => {
        this.notificationsService.unreadCount.set(res.data.unreadCount);
      },
    });
  }
  markAllNotificationsAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe({
      next: (res) => {
        if (res.success) {
          this.getMyNotifications();
          this.getMyUnreadNotifications();
          this.getUnreadNotificationsCount();
        }
      },
    });
  }
  whichButton(e: PointerEvent): void {
    const ele = e.currentTarget as HTMLElement;
    this.buttonId = ele.getAttribute('id');
  }
}
