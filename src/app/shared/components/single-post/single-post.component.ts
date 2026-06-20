import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  HostListener,
  inject,
  Input,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PostsService } from '../../../core/services/posts/posts.service';
import { CommentsComponent } from '../comments/comments.component';
import { Post } from './models/all-posts-data.interface';
import { initFlowbite } from 'flowbite';
import { Like } from './models/likes-data.interface';

@Component({
  selector: 'app-single-post',
  imports: [CommentsComponent, ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css',
})
export class SinglePostComponent implements OnInit {
  @Input({ required: true }) data: Post = {} as Post;
  private readonly postsService = inject(PostsService);
  isOpen: boolean = false;
  isPostOptionsOpen: boolean = false;
  isEditing: boolean = false;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  userId: Signal<string> = computed(() => this.postsService.userId());
  postContent: FormControl = new FormControl('');
  sharePostContent: FormControl = new FormControl('');
  isShareModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;
  isPostImageOpen: boolean = false;
  isLikesListOpen: boolean = false;
  likesList: WritableSignal<Like[]> = signal<Like[]>([]);
  isLikesLoading: WritableSignal<boolean> = signal<boolean>(false);
  ngOnInit(): void {
    initFlowbite();
  }
  deleteMyPost(postId: string): void {
    this.postsService.deletePost(postId).subscribe({
      next: () => {
        this.postsService.updateAllPostsAfterDelete(postId);
      },
    });
  }
  onSubmitEditPostForm(e: SubmitEvent): void {
    e.preventDefault();
    const formData: FormData = new FormData();
    if (this.postContent.value) {
      formData.append('body', this.postContent.value);
    }
    this.isLoading.set(true);
    this.postsService.editPost(this.data._id, formData).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.postContent.reset();
          this.closeEditing();
          this.data.body = res.data.post.body;
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    });
  }
  bookmarkPost(postId: string): void {
    const oldBookmarked = this.data.bookmarked;
    const oldSavedPosts = [...this.postsService.savedPosts()];
    if (this.data.bookmarked) {
      this.data.bookmarked = false;
      this.postsService.savedPosts.update((curr) => curr.filter((item) => item._id !== postId));
    } else if (!this.data.bookmarked) {
      this.data.bookmarked = true;
    }
    this.postsService.savePost(postId).subscribe({
      error: () => {
        this.data.bookmarked = oldBookmarked;
        this.postsService.savedPosts.update(() => oldSavedPosts);
      },
    });
  }
  likeAndUnlikePost(id: string): void {
    const oldLikes = [...this.data.likes];
    const oldLikesCount = this.data.likesCount;
    const isLiked = this.likedByMe();
    if (isLiked) {
      this.data.likesCount--;
      this.data.likes = this.data.likes.filter((item) => item !== this.userId());
    } else if (!isLiked) {
      this.data.likesCount++;
      this.data.likes = [...this.data.likes, this.userId()];
    }
    this.postsService.likePost(id).subscribe({
      error: () => {
        this.data.likes = oldLikes;
        this.data.likesCount = oldLikesCount;
      },
    });
  }
  sharePosts(postId: string): void {
    this.postsService.sharePost(postId, this.sharePostContent.value).subscribe({
      next: (res) => {
        this.sharePostContent.reset();
        this.postsService.updateAllPostContent(res.data.post);
      },
      error: () => {
        this.sharePostContent.reset();
      },
    });
  }
  getPostLikesList(postId: string): void {
    this.isLikesLoading.set(true);
    this.postsService.getPostLikes(postId).subscribe({
      next: (res) => {
        this.isLikesLoading.set(false);
        this.likesList.set(res.data.likes);
      },
      error: () => {
        this.isLikesLoading.set(false);
      },
    });
  }
  openEditing(): void {
    this.isEditing = true;
    this.postContent.setValue(this.data.body);
  }
  closeEditing(): void {
    this.isEditing = false;
  }
  toggleIsOpen(): void {
    this.isOpen = !this.isOpen;
  }
  likedByMe(): boolean {
    return this.data.likes.includes(this.userId());
  }
  toggleOpenPostOptions(e: MouseEvent): void {
    e.stopPropagation();
    this.isPostOptionsOpen = !this.isPostOptionsOpen;
  }
  @HostListener('document:click') closeMenu(): void {
    this.isPostOptionsOpen = false;
  }
  openShareModal(): void {
    this.isShareModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeShareModal(): void {
    this.isShareModalOpen = false;
    document.body.style.overflow = '';
  }
  openDeleteModal(): void {
    this.isDeleteModalOpen = true;
    document.body.style.overflow = 'hidden';
  }
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    document.body.style.overflow = '';
  }
  openPostImagePreview(): void {
    this.isPostImageOpen = true;
    document.body.style.overflow = 'hidden';
  }
  closePostImagePreview(): void {
    this.isPostImageOpen = false;
    document.body.style.overflow = '';
  }
  openLikesList(): void {
    this.isLikesListOpen = true;
    document.body.style.overflow = 'hidden';
  }
  closeLikesList(): void {
    this.isLikesListOpen = false;
    document.body.style.overflow = '';
  }
  showLikesList(): void {
    if (this.data.likesCount) {
      this.getPostLikesList(this.data._id);
      this.openLikesList();
    }
  }
}
