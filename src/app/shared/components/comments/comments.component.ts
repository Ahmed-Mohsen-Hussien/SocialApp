import {
  Component,
  computed,
  HostListener,
  inject,
  Input,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../../core/models/my-profile-data.interface';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { Comment } from './models/comments-data.interface';
import { SingleCommentComponent } from '../single-comment/single-comment.component';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { AuthService } from '../../../core/auth/services/auth.service';
import { PostsService } from '../../../core/services/posts/posts.service';
import { PaginationInstance } from 'ngx-pagination';

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule, SingleCommentComponent, PickerComponent],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  @Input({ required: true }) postID!: string;
  @Input({ required: true }) postCreatorId!: string;
  private readonly commentsService = inject(CommentsService);
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  isLoadingMore: WritableSignal<boolean> = signal<boolean>(false);
  hasMore: WritableSignal<boolean> = signal<boolean>(false);
  profileData: Signal<User> = computed(() => this.commentsService.profile());
  commentControl: FormControl = new FormControl('');
  commentList: WritableSignal<Comment[]> = signal([]);
  uploadedFile: File | null = null;
  postText: string = '';
  imagePath: string = '';
  showEmojis: boolean = false;
  numberOfPages: number = 0;
  pagination: PaginationInstance = {
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: 0,
  };
  ngOnInit(): void {
    this.getPostCommentsData();
    this.isLoading.set(true);
    this.getUserId();
  }
  getPostCommentsData(): void {
    this.commentsService
      .getPostComments(this.postID, this.pagination.itemsPerPage, this.pagination.currentPage)
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.isLoadingMore.set(false);
            this.isLoading.set(false);
            this.commentList.set([...this.commentList(), ...res.data.comments]);
            this.pagination.totalItems = res.meta.pagination.total;
            this.numberOfPages = res.meta.pagination.numberOfPages;
            if (this.pagination.currentPage >= this.numberOfPages) {
              this.hasMore.set(false);
              return;
            } else {
              this.hasMore.set(true);
            }
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.isLoadingMore.set(false);
        },
      });
  }
  viewMoreComments(): void {
    if (this.pagination.currentPage >= this.numberOfPages) {
      return;
    }
    this.pagination.currentPage++;
    this.isLoadingMore.set(true);
    this.getPostCommentsData();
  }

  fileUploaded(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input) {
      if (input.files) {
        this.uploadedFile = input.files[0];
        this.imagePath = URL.createObjectURL(this.uploadedFile);
      }
    }
  }
  onSubmitCommentForm(e: SubmitEvent): void {
    e.preventDefault();
    const formData: FormData = new FormData();
    if (this.commentControl.value) {
      formData.append('content', this.commentControl.value);
    }
    if (this.uploadedFile) {
      formData.append('image', this.uploadedFile);
    }
    this.commentsService.createComment(formData, this.postID).subscribe({
      next: (res) => {
        if (res.success) {
          this.commentControl.reset();
          if (this.commentList().length === 0) {
            this.postsService.updateTopComment(this.postID);
          } else {
            this.postsService.updateAllPostsComments(this.postID, 1);
          }
          this.commentList.set([res.data.comment, ...this.commentList()]);
          this.closeFile();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  closeFile(): void {
    this.imagePath = '';
    this.uploadedFile = null;
    const input = document.getElementById('commentInput') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }
  toggleShowEmoji(e: MouseEvent): void {
    e.stopPropagation();
    this.showEmojis = !this.showEmojis;
  }
  @HostListener('document:click') closeMenu(): void {
    this.showEmojis = false;
  }
  addEmoji(e: any): void {
    this.postText += e.emoji.native;
  }
  getUserId(): void {
    const decoded = this.authService.decodeUserToken();
    if (!decoded?.user) return;
    this.commentsService.userId.set(decoded.user);
  }
}
