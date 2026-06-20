import { Component, Input } from '@angular/core';
import { Post } from '../single-post/models/all-posts-data.interface';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-single-post-profile',
  imports: [RouterLink, DatePipe],
  templateUrl: './single-post-profile.component.html',
  styleUrl: './single-post-profile.component.css',
})
export class SinglePostProfileComponent {
  @Input({ required: true }) item: Post = {} as Post;
}
