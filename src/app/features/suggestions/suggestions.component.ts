import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule, PaginationInstance } from 'ngx-pagination';
import { Suggestion } from '../../core/models/suggestions.interface';
import { SuggestionsService } from '../../core/services/suggestions/suggestions.service';
import { PostLoadingComponent } from '../../shared/components/post-loading/post-loading.component';
import { SingleSuggestionComponent } from '../../shared/components/single-suggestion/single-suggestion.component';

@Component({
  selector: 'app-suggestions',
  imports: [
    RouterLink,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    PostLoadingComponent,
    SingleSuggestionComponent,
  ],
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css',
})
export class SuggestionsComponent {
  private readonly SuggestionsService = inject(SuggestionsService);
  suggestionsList: WritableSignal<Suggestion[]> = signal<Suggestion[]>([]);
  isLoadingMore: WritableSignal<boolean> = signal<boolean>(false);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  hasMore: WritableSignal<boolean> = signal<boolean>(false);
  searchWord: string = '';
  numberOfPages: number = 0;
  pagination: PaginationInstance = {
    itemsPerPage: 20,
    currentPage: 1,
    totalItems: 0,
  };
  ngOnInit(): void {
    this.isLoading.set(true);
    this.getRecommendedFollowers();
  }
  getRecommendedFollowers(): void {
    this.SuggestionsService.getAllSuggestions(20, 1, this.searchWord).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.suggestionsList.set(res.data.suggestions);
        this.pagination.totalItems = res.meta.pagination.total;
        this.numberOfPages = res.meta.pagination.numberOfPages;
        if (this.pagination.currentPage >= this.numberOfPages) {
          this.hasMore.set(false);
          return;
        } else {
          this.hasMore.set(true);
          this.isLoading.set(false);
        }
      },
    });
  }
  viewMoreSuggestion(): void {
    if (this.pagination.currentPage >= this.numberOfPages) return;
    this.pagination.currentPage++;
    this.isLoadingMore.set(true);
    this.SuggestionsService.getAllSuggestions(
      this.pagination.itemsPerPage,
      this.pagination.currentPage,
      this.searchWord,
    ).subscribe({
      next: (res) => {
        this.isLoadingMore.set(false);
        this.suggestionsList.set([...this.suggestionsList(), ...res.data.suggestions]);
        this.pagination.totalItems = res.meta.pagination.total;
        this.numberOfPages = res.meta.pagination.numberOfPages;
      },
      error: () => {
        this.isLoadingMore.set(false);
      },
    });
  }
}
