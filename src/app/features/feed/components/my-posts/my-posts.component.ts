import { Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { PostsService } from '../../../../core/services/posts/posts.service';
import { Post } from '../../../../shared/components/single-post/models/all-posts-data.interface';
import { SinglePostComponent } from '../../../../shared/components/single-post/single-post.component';
import { PostLoadingComponent } from '../../../../shared/components/post-loading/post-loading.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@Component({
  selector: 'app-my-posts',
  imports: [SinglePostComponent, PostLoadingComponent, InfiniteScrollModule],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
})
export class MyPostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);
  myPosts: Signal<Post[]> = computed(() => this.postsService.myPosts());
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  loadPosts: WritableSignal<boolean> = signal<boolean>(false);
  endContent: WritableSignal<boolean> = signal<boolean>(false);
  userId!: string;
  numberOfPages: number = 0;
  pagination: PaginationInstance = {
    itemsPerPage: 40,
    currentPage: 1,
    totalItems: 0,
  };
  ngOnInit(): void {
    this.isLoading.set(true);
    this.postsService.myPosts.set([]);
    this.getMyPosts();
  }
  getMyPosts(): void {
    this.getUserId();
    if (this.userId) {
      this.loadPosts.set(true);
      this.postsService
        .getUserPosts(this.userId, this.pagination.itemsPerPage, this.pagination.currentPage)
        .subscribe({
          next: (res) => {
            this.isLoading.set(false);
            this.loadPosts.set(false);
            this.postsService.myPosts.set([...this.postsService.myPosts(), ...res.data.posts]);
            this.pagination.totalItems = res.meta.pagination.total;
            this.numberOfPages = res.meta.pagination.numberOfPages;
          },
          error: () => {
            this.isLoading.set(false);
            this.loadPosts.set(false);
          },
        });
    }
  }
  getUserId(): void {
    this.userId = this.authService.decodeUserToken().user;
  }
  viewMorePosts(): void {
    if (this.loadPosts() || !this.postsService.myPosts().length) {
      return;
    }
    if (this.pagination.currentPage >= this.numberOfPages) {
      this.endContent.set(true);
      return;
    }

    this.pagination.currentPage++;
    this.getMyPosts();
  }
}
