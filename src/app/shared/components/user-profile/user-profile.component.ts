import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { UserProfileData } from '../../../core/models/user-profile-data.interface';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { PostsService } from '../../../core/services/posts/posts.service';
import { Post } from '../single-post/models/all-posts-data.interface';
import { Location } from '@angular/common';
import { SinglePostComponent } from '../single-post/single-post.component';
import { AuthService } from '../../../core/auth/services/auth.service';
import { FollowService } from '../../../core/services/follow/follow.service';
import { PostLoadingComponent } from '../post-loading/post-loading.component';

@Component({
  selector: 'app-user-profile',
  imports: [SinglePostComponent, PostLoadingComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly commentsService = inject(CommentsService);
  private readonly followService = inject(FollowService);
  private readonly authService = inject(AuthService);
  private readonly postsService = inject(PostsService);
  private readonly location = inject(Location);
  userProfileData: WritableSignal<UserProfileData> = signal<UserProfileData>({} as UserProfileData);
  userPostsData: Signal<Post[]> = computed(() => this.postsService.userPostsData());
  userId: string | null = null;
  isLoadingPosts: WritableSignal<boolean> = signal<boolean>(false);
  isLoadingProfile: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.isLoadingProfile.set(true);
    this.getUserId();
    this.getUserProfileData();
    this.getMyProfileData();
    this.getUserPostsData();
    this.getMyId();
  }
  getUserProfileData(): void {
    this.profileService.getUserProfile(this.userId).subscribe({
      next: (res) => {
        this.isLoadingProfile.set(false);
        this.userProfileData.set(res.data);
      },
      error: () => {
        this.isLoadingProfile.set(false);
      },
    });
  }
  getMyProfileData(): void {
    this.isLoadingPosts.set(true);
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        this.isLoadingPosts.set(false);
        this.commentsService.profile.set(res.data.user);
      },
      error: () => {
        this.isLoadingPosts.set(false);
      },
    });
  }
  getUserId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.userId = params.get('id');
      },
    });
  }
  getUserPostsData(): void {
    this.isLoadingPosts.set(true);
    this.postsService.getUserPosts(this.userId).subscribe({
      next: (res) => {
        this.postsService.userPostsData.set(res.data.posts);
        this.isLoadingPosts.set(false);
      },
      error: () => {
        this.isLoadingPosts.set(false);
      },
    });
  }
  followAndUnfollowUsers(userId: string): void {
    const oldIsFollowing = this.userProfileData().isFollowing;
    this.userProfileData().isFollowing = !this.userProfileData().isFollowing;
    this.followService.followUser(userId).subscribe({
      error: () => {
        this.userProfileData().isFollowing = oldIsFollowing;
      },
    });
  }
  goBack(): void {
    this.location.back();
  }
  getMyId(): void {
    this.postsService.userId.set(this.authService.decodeUserToken().user);
  }
}
