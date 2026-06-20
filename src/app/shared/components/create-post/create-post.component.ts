import { Component, HostListener, inject, Input, signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MyProfileData } from '../../../core/models/my-profile-data.interface';
import { PostsService } from '../../../core/services/posts/posts.service';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule, PickerComponent, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent {
  private readonly postsService = inject(PostsService);
  @Input({ required: true }) myProfileData: MyProfileData = {} as MyProfileData;
  postText: string = '';
  postContent: FormControl = new FormControl('');
  uploadedFile: File | null = null;
  imagePath: string = '';
  showEmojis: boolean = false;
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  fileUploaded(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input) {
      if (input.files) {
        this.uploadedFile = input.files[0];
        this.imagePath = URL.createObjectURL(this.uploadedFile);
      }
    }
  }
  onSubmitCreatePostForm(e: SubmitEvent): void {
    e.preventDefault();
    const formData: FormData = new FormData();
    if (this.postContent.value) {
      formData.append('body', this.postContent.value);
    }
    if (this.uploadedFile) {
      formData.append('image', this.uploadedFile);
    }
    this.isLoading.set(true);
    this.postsService.createPosts(formData).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          const postData = this.postsService.buildNewPost(res.data.post, this.myProfileData);
          this.postsService.updateAllPostContent(postData);
          this.postContent.reset();
          this.closeFile();
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    });
  }
  closeFile(): void {
    this.imagePath = '';
    this.uploadedFile = null;
    const input = document.getElementById('coverImg') as HTMLInputElement;
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
