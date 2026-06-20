import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth/services/auth.service';
import { MyProfileData } from '../../core/models/my-profile-data.interface';
import { Suggestion } from '../../core/models/suggestions.interface';
import { CommentsService } from '../../core/services/comments/comments.service';
import { PostsService } from '../../core/services/posts/posts.service';
import { ProfileService } from '../../core/services/profile/profile.service';
import { SuggestionsService } from '../../core/services/suggestions/suggestions.service';
import { CreatePostComponent } from '../../shared/components/create-post/create-post.component';
import { SingleSuggestionComponent } from '../../shared/components/single-suggestion/single-suggestion.component';
import { PostLoadingComponent } from '../../shared/components/post-loading/post-loading.component';

@Component({
  selector: 'app-feed',
  imports: [
    CreatePostComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    FormsModule,
    SingleSuggestionComponent,
    PostLoadingComponent,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.css',
})
export class FeedComponent implements OnInit {
  private readonly SuggestionsService = inject(SuggestionsService);
  private readonly commentsService = inject(CommentsService);
  private readonly profileService = inject(ProfileService);
  private readonly postsService = inject(PostsService);
  private readonly authService = inject(AuthService);
  myProfileData: WritableSignal<MyProfileData> = signal<MyProfileData>({} as MyProfileData);
  suggestionsList: WritableSignal<Suggestion[]> = signal<Suggestion[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  isSuggestedOpen: boolean = false;
  searchWord: string = '';
  ngOnInit(): void {
    this.getMyProfileData();
    this.getRecommendedFollowers();
    this.getUserId();
  }
  getMyProfileData(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.myProfileData.set(res.data);
          this.commentsService.profile.set(res.data.user);
        }
      },
    });
  }
  getRecommendedFollowers(): void {
    this.isLoading.set(true);
    this.SuggestionsService.getAllSuggestions(5, 1, this.searchWord).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.suggestionsList.set(res.data.suggestions);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
  getUserId(): void {
    this.postsService.userId.set(this.authService.decodeUserToken().user);
  }
  openSuggestedFriends(): void {
    this.isSuggestedOpen = !this.isSuggestedOpen;
  }
}
