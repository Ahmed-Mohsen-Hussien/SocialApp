import { Location } from '@angular/common';
import { Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { PostInfo } from '../../core/models/post-details.interface';
import { CommentsService } from '../../core/services/comments/comments.service';
import { PostsService } from '../../core/services/posts/posts.service';
import { ProfileService } from '../../core/services/profile/profile.service';
import { SinglePostComponent } from '../../shared/components/single-post/single-post.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-post-details',
  imports: [SinglePostComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  private postsService = inject(PostsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly profileService = inject(ProfileService);
  private readonly commentsService = inject(CommentsService);
  private readonly authService = inject(AuthService);
  private readonly location = inject(Location);
  postData: Signal<PostInfo> = computed(() => this.postsService.postData());
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  errorMsg: WritableSignal<boolean> = signal<boolean>(false);
  postId: string | null = null;
  ngOnInit(): void {
    this.getPostId();
    this.getPostData();
    this.getMyProfileData();
    this.getUserId();
  }
  getPostId(): void {
    this.activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.postId = params.get('id');
      },
    });
  }
  getPostData(): void {
    this.isLoading.set(true);
    this.postsService.getSinglePost(this.postId).subscribe({
      next: (res) => {
        if (res.success) {
          this.isLoading.set(false);
          this.postsService.postData.set(res.data.post);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMsg.set(err.error.message);
      },
    });
  }
  getMyProfileData(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.commentsService.profile.set(res.data.user);
        }
      },
    });
  }
  getUserId(): void {
    this.postsService.userId.set(this.authService.decodeUserToken().user);
  }
  goBack(): void {
    this.location.back();
  }
}
