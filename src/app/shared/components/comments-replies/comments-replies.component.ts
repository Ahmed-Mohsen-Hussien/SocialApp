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
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { User } from '../../../core/models/my-profile-data.interface';
import { CommentsService } from '../../../core/services/comments/comments.service';
import { SingleCommentReplyComponent } from '../single-comment-reply/single-comment-reply.component';
import { Reply } from './models/comments-replies-data.interface';
import { Comment } from '../comments/models/comments-data.interface';

@Component({
  selector: 'app-comments-replies',
  imports: [SingleCommentReplyComponent, ReactiveFormsModule, PickerComponent],
  templateUrl: './comments-replies.component.html',
  styleUrl: './comments-replies.component.css',
})
export class CommentsRepliesComponent implements OnInit {
  @Input({ required: true }) commentId!: string;
  @Input({ required: true }) postId!: string;
  @Input({ required: true }) postCreatorId!: string;
  @Input({ required: true }) commentList: WritableSignal<Comment[]> = signal([]);
  private readonly commentsService = inject(CommentsService);
  profileData: Signal<User> = computed(() => this.commentsService.profile());
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  replyControl: FormControl = new FormControl('');
  uploadedFile: File | null = null;
  imagePath: string = '';
  postText: string = '';
  showEmojis: boolean = false;
  commentReplies: WritableSignal<Reply[]> = signal<Reply[]>([]);
  ngOnInit(): void {
    this.getPostCommentReplies();
  }
  getPostCommentReplies(): void {
    this.isLoading.set(true);
    this.commentsService.getCommentReplies(this.postId, this.commentId).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.commentReplies.set(res.data.replies);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
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
  onSubmitReplyForm(e: SubmitEvent): void {
    e.preventDefault();
    const formData: FormData = new FormData();
    if (this.replyControl.value) {
      formData.append('content', this.replyControl.value);
    }
    if (this.uploadedFile) {
      formData.append('image', this.uploadedFile);
    }
    this.commentsService.createReply(formData, this.postId, this.commentId).subscribe({
      next: (res) => {
        if (res.success) {
          console.log(res);
          this.commentReplies.set([res.data.reply, ...this.commentReplies()]);
          this.commentList.update((curr) =>
            curr.map((item) =>
              item._id === this.commentId ? { ...item, repliesCount: item.repliesCount + 1 } : item,
            ),
          );
          this.replyControl.reset();
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
    const input = document.getElementById('commentReplyInput') as HTMLInputElement;
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
}
