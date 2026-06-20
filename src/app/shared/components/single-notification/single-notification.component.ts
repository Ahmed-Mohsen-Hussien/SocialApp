import { DatePipe } from '@angular/common';
import { Component, computed, inject, Input, Signal, signal, WritableSignal } from '@angular/core';
import { Notification } from '../../../core/models/notifications-data.interface';
import { NotificationsService } from '../../../core/services/notifications/notifications.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-notification',
  imports: [DatePipe, RouterLink],
  templateUrl: './single-notification.component.html',
  styleUrl: './single-notification.component.css',
})
export class SingleNotificationComponent {
  @Input({ required: true }) data: Notification = {} as Notification;
  private readonly notificationsService = inject(NotificationsService);
  loading: Signal<boolean> = computed(() => this.notificationsService.isLoading());
  markNotificationAsRead(id: string, e: PointerEvent): void {
    e.stopPropagation();
    const oldIsRead = this.data.isRead;
    const oldUnreadNotifications = [...this.notificationsService.unreadNotificationsList()];
    this.data.isRead = true;
    this.notificationsService.unreadCount.update((curr) => curr - 1);
    this.notificationsService.unreadNotificationsList.update((curr) =>
      curr.filter((item) => item._id !== id),
    );
    this.notificationsService.allNotificationsList.update((curr) =>
      curr.map((item) => (item._id === id ? { ...item, isRead: this.data.isRead } : item)),
    );
    this.notificationsService.isLoading.set(true);
    this.notificationsService.markAsRead(id).subscribe({
      next: () => {
        this.notificationsService.isLoading.set(false);
      },
      error: () => {
        this.data.isRead = oldIsRead;
        this.notificationsService.unreadCount.update((curr) => curr + 1);
        this.notificationsService.unreadNotificationsList.update(() => oldUnreadNotifications);
        this.notificationsService.allNotificationsList.update((curr) =>
          curr.map((item) => (item._id === id ? { ...item, isRead: this.data.isRead } : item)),
        );
      },
    });
  }
}
