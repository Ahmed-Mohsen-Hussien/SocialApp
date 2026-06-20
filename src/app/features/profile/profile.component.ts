import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { PostsService } from '../../core/services/posts/posts.service';
import { SinglePostProfileComponent } from '../../shared/components/single-post-profile/single-post-profile.component';
import { Post } from '../../shared/components/single-post/models/all-posts-data.interface';
import { User } from './../../core/models/my-profile-data.interface';
import { ProfileService } from './../../core/services/profile/profile.service';
import { UserProfileData } from '../../core/models/user-profile-data.interface';
import { RouterLink } from '@angular/router';
import { FollowService } from '../../core/services/follow/follow.service';

@Component({
  selector: 'app-profile',
  imports: [SinglePostProfileComponent, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);
  private readonly followService = inject(FollowService);
  myProfileData: WritableSignal<User> = signal<User>({} as User);
  myPosts: WritableSignal<Post[]> = signal<Post[]>([]);
  savedPosts: WritableSignal<Post[]> = signal<Post[]>([]);
  userId: string | null = null;
  buttonId: string | null = null;
  profileImageOpen: boolean = false;
  coverImageOpen: boolean = false;
  uploadedFile: File | null = null;
  imagePath: string = '';
  isChangeCoverOpen: boolean = false;
  isChangePhotoOpen: boolean = false;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  isFollowersLoading: WritableSignal<boolean> = signal<boolean>(false);
  isFollowingLoading: WritableSignal<boolean> = signal<boolean>(false);
  followersList: WritableSignal<string[]> = signal<string[]>([]);
  followers: WritableSignal<UserProfileData[]> = signal<UserProfileData[]>([]);
  following: WritableSignal<UserProfileData[]> = signal<UserProfileData[]>([]);
  isFollowersListOpen: boolean = false;
  isFollowingListOpen: boolean = false;
  followingsList: WritableSignal<string[]> = signal<string[]>([]);
  isLoadingProfile: WritableSignal<boolean> = signal<boolean>(false);
  ngOnInit(): void {
    this.isLoadingProfile.set(true);
    this.buttonId = 'myPosts';
    this.getMyProfileData();
    this.getUserPostsData();
    this.getSavedPosts();
  }

  getMyProfileData(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.myProfileData.set(res.data.user);
          this.followersList.set(res.data.user.followers);
          this.followingsList.set(res.data.user.following);
          this.userId = res.data.user.id;
        }
        this.isLoadingProfile.set(false);
      },
      error: () => {
        this.isLoadingProfile.set(false);
      },
    });
  }
  getUserPostsData(): void {
    this.getUserId();
    if (this.userId) {
      this.postsService.getUserPosts(this.userId).subscribe({
        next: (res) => {
          this.myPosts.set(res.data.posts);
        },
      });
    }
  }
  getSavedPosts(): void {
    this.postsService.getBookmarks().subscribe({
      next: (res) => {
        this.savedPosts.set(res.data.bookmarks);
      },
    });
  }
  fileCoverUploaded(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input) {
      if (input.files) {
        this.uploadedFile = input.files[0];
        this.imagePath = URL.createObjectURL(this.uploadedFile);
        if (this.uploadedFile) {
          this.openCoverModal();
        }
      }
    }
  }
  filePhotoUploaded(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input) {
      if (input.files) {
        this.uploadedFile = input.files[0];
        this.imagePath = URL.createObjectURL(this.uploadedFile);
        if (this.uploadedFile) {
          this.openPhotoModal();
        }
      }
    }
  }
  removeCoverImage(): void {
    const oldImage = this.myProfileData().cover;
    this.myProfileData().cover = '';
    this.profileService.removeCoverImage().subscribe({
      error: () => {
        this.myProfileData().cover = oldImage;
      },
    });
  }
  uploadUserCoverImage(): void {
    const formData = new FormData();
    if (this.uploadedFile) {
      formData.append('cover', this.uploadedFile);
    }
    this.isLoading.set(true);
    this.profileService.uploadCoverImage(formData).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.myProfileData.update((curr) => ({ ...curr, cover: res.data.cover }));
          this.closeCoverModal();
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
  uploadUserPhotoImage(): void {
    const formData = new FormData();
    if (this.uploadedFile) {
      formData.append('photo', this.uploadedFile);
    }
    this.isLoading.set(true);
    this.profileService.uploadProfileImage(formData).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.myProfileData.update((curr) => ({ ...curr, photo: res.data.photo }));
          this.closePhotoModal();
        }
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  closeFile(): void {
    this.imagePath = '';
    this.uploadedFile = null;
    const input = document.getElementById('myInput') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
  openCoverModal(): void {
    this.isChangeCoverOpen = true;
    document.body.style.overflow = 'hidden';
  }
  closeCoverModal(): void {
    this.isChangeCoverOpen = false;
    document.body.style.overflow = '';
    this.closeFile();
  }
  openPhotoModal(): void {
    this.isChangePhotoOpen = true;
    document.body.style.overflow = 'hidden';
  }
  closePhotoModal(): void {
    this.isChangePhotoOpen = false;
    document.body.style.overflow = '';
    this.closeFile();
  }
  openProfileImagePreview(): void {
    this.profileImageOpen = true;
    document.body.style.overflow = 'hidden';
  }
  openCoverImagePreview(): void {
    this.coverImageOpen = true;
    document.body.style.overflow = 'hidden';
  }
  closeProfileImagePreview(): void {
    this.profileImageOpen = false;
    document.body.style.overflow = '';
  }
  closeCoverImagePreview(): void {
    this.coverImageOpen = false;
    document.body.style.overflow = '';
  }
  openFollowersList(): void {
    this.isFollowersListOpen = true;
    document.body.style.overflow = 'hidden';
    this.isFollowersLoading.set(true);
    this.followersList().forEach((i) => {
      this.profileService.getUserProfile(i).subscribe({
        next: (res) => {
          this.isFollowersLoading.set(false);
          if (res.success) {
            this.followers.set([...this.followers(), res.data]);
          }
        },
        error: () => {
          this.isFollowersLoading.set(false);
        },
      });
    });
  }
  closeFollowersList(): void {
    this.isFollowersListOpen = false;
    document.body.style.overflow = '';
    this.followers.set([]);
  }
  openFollowingList(): void {
    this.isFollowingListOpen = true;
    document.body.style.overflow = 'hidden';
    this.isFollowingLoading.set(true);
    this.followingsList().forEach((i) => {
      this.profileService.getUserProfile(i).subscribe({
        next: (res) => {
          this.isFollowingLoading.set(false);
          if (res.success) {
            this.following.set([...this.following(), res.data]);
          }
        },
        error: () => {
          this.isFollowingLoading.set(false);
        },
      });
    });
  }
  followAndUnfollowUsers(userId: string, item: UserProfileData): void {
    const oldFollowing = [...this.following()];
    const oldFollowingsList = [...this.followingsList()];
    const oldFollowingCount = this.myProfileData().followingCount;
    this.following.update((curr) => curr.filter((ele) => ele.user.id != item.user.id));
    this.followingsList.update((curr) => curr.filter((ele) => ele != item.user.id));
    this.myProfileData().followingCount--;
    this.followService.followUser(userId).subscribe({
      error: () => {
        this.myProfileData().followingCount = oldFollowingCount;
        this.following.set(oldFollowing);

        this.followingsList.set(oldFollowingsList);
      },
    });
  }
  closeFollowingList(): void {
    this.isFollowingListOpen = false;
    document.body.style.overflow = '';
    this.following.set([]);
  }
  getUserId(): void {
    this.userId = this.authService.decodeUserToken().user;
  }
  whichBtn(e: PointerEvent): void {
    const ele = e.currentTarget as HTMLElement;
    this.buttonId = ele.getAttribute('id');
  }
}
