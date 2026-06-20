import {
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth.service';
import { NotificationsService } from '../../../../services/notifications/notifications.service';
import { ProfileService } from '../../../../services/profile/profile.service';
import { MyProfileData } from '../../../../models/my-profile-data.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly notificationsService = inject(NotificationsService);
  private readonly profileService = inject(ProfileService);
  myProfileData: WritableSignal<MyProfileData> = signal<MyProfileData>({} as MyProfileData);
  isOpen: boolean = false;
  unreadNotificationCount: Signal<number> = computed(() => this.notificationsService.unreadCount());
  ngOnInit(): void {
    this.getUnreadNotificationsCount();
    this.getMyProfileData();
  }
  logOut(): void {
    this.authService.signOut();
  }
  toggleDropMenu(e: MouseEvent): void {
    e.stopPropagation();
    this.isOpen = !this.isOpen;
  }
  @HostListener('document:click') closeMenu(): void {
    this.isOpen = false;
  }
  getMyProfileData(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.myProfileData.set(res.data);
        }
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
}
