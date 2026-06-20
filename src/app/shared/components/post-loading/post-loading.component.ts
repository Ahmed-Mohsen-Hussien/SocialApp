import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-loading',
  imports: [],
  templateUrl: './post-loading.component.html',
  styleUrl: './post-loading.component.css',
})
export class PostLoadingComponent {
  @Input({ required: true }) photo: boolean = true;
}
