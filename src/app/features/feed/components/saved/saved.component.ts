import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import {
  Bookmark,
  BookmarkedPostsData,
} from '../../../../core/models/bookmarked-posts-data.interface';
import { PostsService } from '../../../../core/services/posts/posts.service';
import { SinglePostComponent } from '../../../../shared/components/single-post/single-post.component';
import { PostLoadingComponent } from '../../../../shared/components/post-loading/post-loading.component';
import { PaginationInstance } from 'ngx-pagination';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
@Component({
  selector: 'app-saved',
  imports: [SinglePostComponent, PostLoadingComponent, InfiniteScrollModule],
  templateUrl: './saved.component.html',
  styleUrl: './saved.component.css',
})
export class SavedComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  savedPosts: Signal<Bookmark[]> = computed(() => this.postsService.savedPosts());
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  loadPosts: WritableSignal<boolean> = signal<boolean>(false);
  endContent: WritableSignal<boolean> = signal<boolean>(false);
  ngOnInit(): void {
    this.postsService.savedPosts.set([]);
    this.isLoading.set(true);
    this.getBookmarkedPosts();
  }
  numberOfPages: number = 0;
  pagination: PaginationInstance = {
    itemsPerPage: 40,
    currentPage: 1,
    totalItems: 0,
  };
  getBookmarkedPosts(): void {
    this.loadPosts.set(true);
    this.postsService
      .getBookmarks(this.pagination.itemsPerPage, this.pagination.currentPage)
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this.loadPosts.set(false);
          this.postsService.savedPosts.set([
            ...this.postsService.savedPosts(),
            ...res.data.bookmarks,
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
    if (this.loadPosts() || !this.postsService.savedPosts().length) {
      return;
    }
    if (this.pagination.currentPage >= this.numberOfPages) {
      this.endContent.set(true);
      return;
    }
    this.pagination.currentPage++;
    this.getBookmarkedPosts();
  }
}
