import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  HostListener,
  inject,
  Input,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { PostsService } from '../../../core/services/posts/posts.service';
import { CommentsRepliesComponent } from '../comments-replies/comments-replies.component';
import { Comment } from '../comments/models/comments-data.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-comment',
  imports: [DatePipe, CommentsRepliesComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './single-comment.component.html',
  styleUrl: './single-comment.component.css',
})
export class SingleCommentComponent {
  @Input({ required: true }) item: Comment = {} as Comment;
  @Input({ required: true }) commentList: WritableSignal<Comment[]> = signal([]);
  @Input({ required: true }) postCreatorId!: string;
  private readonly commentsService = inject(CommentsService);
  private readonly postsService = inject(PostsService);
  userId: Signal<string> = computed(() => this.commentsService.userId());
  isRepliesOpen: boolean = false;
  isCommentOptionsOpen: boolean = false;
  isEditing: boolean = false;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  commentContent: FormControl = new FormControl('');
  isDeleteModalOpen: boolean = false;
  likeAndUnlikeComment(postId: string, commentId: string): void {
    const oldLikes = [...this.item.likes];
    const isLiked = this.likedByMe();
    if (isLiked) {
      this.item.likes = this.item.likes.filter((item) => item != this.userId());
    } else if (!isLiked) {
      this.item.likes = [...this.item.likes, this.userId()];
    }
    this.commentsService.likeComment(postId, commentId).subscribe({
      error: () => {
        this.item.likes = oldLikes;
      },
    });
  }
  deleteUserComment(commentId: string): void {
    this.commentsService.deleteComment(this.item.post, commentId).subscribe({
      next: (res) => {
        if (res.success) {
          if (this.commentList().length === 1) {
            this.postsService.updateTopComment(this.item.post);
          } else {
            this.postsService.updateAllPostsComments(this.item.post, -1);
          }
          this.commentList.update((curr) => curr.filter((item) => item._id != commentId));
        }
      },
    });
  }
  onSubmitEditCommentForm(e: SubmitEvent): void {
    e.preventDefault();
    const formData: FormData = new FormData();
    if (this.commentContent.value) {
      formData.append('content', this.commentContent.value);
    }
    this.isLoading.set(true);
    this.commentsService.editComment(this.item.post, this.item._id, formData).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.commentContent.reset();
          this.closeEditing();
          this.commentList.update((curr) =>
            curr.map((item) =>
              item._id === this.item._id ? { ...item, content: res.data.comment.content } : item,
            ),
          );
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    });
  }
  toggleOpenCommentOptions(e: MouseEvent): void {
    e.stopPropagation();
    this.isCommentOptionsOpen = !this.isCommentOptionsOpen;
  }
  @HostListener('document:click') closeMenu(): void {
    this.isCommentOptionsOpen = false;
  }
  toggleReplies(): void {
    this.isRepliesOpen = !this.isRepliesOpen;
  }
  likedByMe(): boolean {
    return this.item.likes.includes(this.userId());
  }
  openEditing(): void {
    this.isEditing = true;
    this.commentContent.setValue(this.item.content);
  }
  closeEditing(): void {
    this.isEditing = false;
  }
  openDeleteModal(): void {
    this.isDeleteModalOpen = true;
    document.body.style.overflow = 'hidden';
  }
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    document.body.style.overflow = '';
  }
}
