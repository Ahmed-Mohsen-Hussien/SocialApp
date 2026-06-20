import { Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../../../core/services/posts/posts.service';
import { Post } from '../../../../shared/components/single-post/models/all-posts-data.interface';
import { SinglePostComponent } from '../../../../shared/components/single-post/single-post.component';
import { PostLoadingComponent } from '../../../../shared/components/post-loading/post-loading.component';
import { PaginationInstance } from 'ngx-pagination';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@Component({
  selector: 'app-home-feed',
  imports: [SinglePostComponent, PostLoadingComponent, InfiniteScrollModule],
  templateUrl: './home-feed.component.html',
  styleUrl: './home-feed.component.css',
})
export class HomeFeedComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  homeFeed: Signal<Post[]> = computed(() => this.postsService.homeFeed());
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  loadPosts: WritableSignal<boolean> = signal<boolean>(false);
  endContent: WritableSignal<boolean> = signal<boolean>(false);
  ngOnInit(): void {
    this.isLoading.set(true);
    this.postsService.homeFeed.set([]);
    this.getHomeFeedPosts();
  }
  numberOfPages: number = 0;
  pagination: PaginationInstance = {
    itemsPerPage: 40,
    currentPage: 1,
    totalItems: 0,
  };
  getHomeFeedPosts(): void {
    this.loadPosts.set(true);
    this.postsService
      .getHomeFeed(this.pagination.itemsPerPage, this.pagination.currentPage)
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.loadPosts.set(false);
          this.postsService.homeFeed.set([...this.postsService.homeFeed(), ...res.data.posts]);
          this.pagination.totalItems = res.meta.pagination.total;
          this.numberOfPages = res.meta.pagination.numberOfPages;
        },
        error: () => {
          this.isLoading.set(false);
          this.loadPosts.set(false);
        },
      });
  }
  viewMorePosts(): void {
    if (this.loadPosts() || !this.postsService.homeFeed().length) {
      return;
    }
    if (this.pagination.currentPage >= this.numberOfPages) {
      this.endContent.set(true);
      return;
    }
    this.pagination.currentPage++;
    this.getHomeFeedPosts();
  }
}
