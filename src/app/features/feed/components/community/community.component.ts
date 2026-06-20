import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { PostsService } from '../../../../core/services/posts/posts.service';
import { Post } from '../../../../shared/components/single-post/models/all-posts-data.interface';
import { SinglePostComponent } from '../../../../shared/components/single-post/single-post.component';
import { PaginationInstance } from 'ngx-pagination';
import { PostLoadingComponent } from '../../../../shared/components/post-loading/post-loading.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@Component({
  selector: 'app-community',
  imports: [SinglePostComponent, PostLoadingComponent, InfiniteScrollModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.css',
})
export class CommunityComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  loadPosts: WritableSignal<boolean> = signal<boolean>(false);
  endContent: WritableSignal<boolean> = signal<boolean>(false);
  communityPosts: Signal<Post[]> = computed(() => this.postsService.communityPosts());
  numberOfPages: number = 0;
  pagination: PaginationInstance = {
    itemsPerPage: 40,
    currentPage: 1,
    totalItems: 0,
  };
  ngOnInit(): void {
    this.isLoading.set(true);
    this.postsService.communityPosts.set([]);
    this.getCommunityPosts();
  }
  getCommunityPosts(): void {
    this.loadPosts.set(true);
    this.postsService
      .getAllPosts(this.pagination.itemsPerPage, this.pagination.currentPage)
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.loadPosts.set(false);
          this.postsService.communityPosts.set([
            ...this.postsService.communityPosts(),
            ...res.data.posts,
          ]);
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
    if (this.loadPosts() || !this.postsService.communityPosts().length) {
      return;
    }
    if (this.pagination.currentPage >= this.numberOfPages) {
      this.endContent.set(true);
      return;
    }

    this.pagination.currentPage++;
    this.getCommunityPosts();
  }
}
