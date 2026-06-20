import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Suggestion } from '../../../core/models/suggestions.interface';
import { FollowService } from '../../../core/services/follow/follow.service';

@Component({
  selector: 'app-single-suggestion',
  imports: [RouterLink],
  templateUrl: './single-suggestion.component.html',
  styleUrl: './single-suggestion.component.css',
})
export class SingleSuggestionComponent {
  @Input({ required: true }) item: Suggestion = {} as Suggestion;
  @Output() userFollowed = new EventEmitter<void>();
  private readonly followService = inject(FollowService);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  followAndUnfollowUsers(userId: string): void {
    this.isLoading.set(true);
    this.followService.followUser(userId).subscribe({
      next: () => {
        this.userFollowed.emit();
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
