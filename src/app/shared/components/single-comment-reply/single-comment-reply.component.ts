import { DatePipe } from '@angular/common';
import {
  Component,
  computed,
  HostListener,
  inject,
  Input,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { Reply } from '../comments-replies/models/comments-replies-data.interface';
import { Comment } from '../comments/models/comments-data.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-comment-reply',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './single-comment-reply.component.html',
  styleUrl: './single-comment-reply.component.css',
})
export class SingleCommentReplyComponent {
  @Input({ required: true }) data: Reply = {} as Reply;
  @Input({ required: true }) commentList: WritableSignal<Comment[]> = signal([]);
  @Input({ required: true }) commentReplies: WritableSignal<Reply[]> = signal<Reply[]>([]);
  @Input({ required: true }) postCreatorId!: string;
  private readonly commentsService = inject(CommentsService);
  isCommentReplyOptionsOpen: boolean = false;
  isEditing: boolean = false;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  replyContent: FormControl = new FormControl('');
  userId: Signal<string> = computed(() => this.commentsService.userId());
  deleteCommentReply(postId: string, commentId: string): void {
    this.commentsService.deleteComment(postId, commentId).subscribe({
      next: () => {
        this.commentReplies.update((curr) => curr.filter((item) => item._id != commentId));
        this.commentList.update((curr) =>
          curr.map((item) =>
            item._id === this.data.parentComment
              ? { ...item, repliesCount: item.repliesCount - 1 }
              : item,
          ),
        );
      },
    });
  }
  likeAndUnlikeComment(postId: string, commentId: string): void {
    const oldLikes = [...this.data.likes];
    const oldLikesCount = this.data.likesCount;
    const isLiked = this.likedByMe();
    if (isLiked) {
      this.data.likesCount--;
      this.data.likes = this.data.likes.filter((item) => item != this.userId());
    } else if (!isLiked) {
      this.data.likesCount++;
      this.data.likes = [...this.data.likes, this.userId()];
    }
    this.commentsService.likeComment(postId, commentId).subscribe({
      error: () => {
        this.data.likes = oldLikes;
        this.data.likesCount = oldLikesCount;
      },
    });
  }
  onSubmitEditReplyForm(e: SubmitEvent): void {
    e.preventDefault();
    const formData: FormData = new FormData();
    if (this.replyContent.value) {
      formData.append('content', this.replyContent.value);
    }
    this.isLoading.set(true);
    this.commentsService.editComment(this.data.post, this.data._id, formData).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.replyContent.reset();
          this.closeEditing();
          this.commentReplies.update((curr) =>
            curr.map((item) =>
              item._id === this.data._id ? { ...item, content: res.data.comment.content } : item,
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
  toggleOpenCommentReplyOptions(e: MouseEvent): void {
    e.stopPropagation();
    this.isCommentReplyOptionsOpen = !this.isCommentReplyOptionsOpen;
  }
  @HostListener('document:click') closeMenu(): void {
    this.isCommentReplyOptionsOpen = false;
  }
  likedByMe(): boolean {
    return this.data.likes.includes(this.userId());
  }
  openEditing(): void {
    this.isEditing = true;
    this.replyContent.setValue(this.data.content);
  }
  closeEditing(): void {
    this.isEditing = false;
  }
}
