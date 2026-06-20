import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import {
  AllPostsDataResponse,
  Post,
} from '../../../shared/components/single-post/models/all-posts-data.interface';
import { LikeUnlikePostResponse } from '../../../shared/components/single-post/models/like-unlike-post.interface';
import {
  Bookmark,
  BookmarkedPostsDataResponse,
} from '../../models/bookmarked-posts-data.interface';
import { CreatePostDataResponse } from '../../models/create-post-data.interface';
import { PostDetailsResponse, PostInfo } from '../../models/post-details.interface';
import { MyProfileData } from '../../models/my-profile-data.interface';
import { Router } from '@angular/router';
import { LikesDataResponse } from '../../../shared/components/single-post/models/likes-data.interface';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  myPosts: WritableSignal<Post[]> = signal<Post[]>([]);
  homeFeed: WritableSignal<Post[]> = signal<Post[]>([]);
  communityPosts: WritableSignal<Post[]> = signal<Post[]>([]);
  savedPosts: WritableSignal<Bookmark[]> = signal<Bookmark[]>([]);
  postData: WritableSignal<PostInfo> = signal<PostInfo>({} as PostInfo);
  userPostsData: WritableSignal<Post[]> = signal<Post[]>([]);
  userId: WritableSignal<string> = signal<string>('');
  getAllPosts(limit: number = 40, page: number = 1): Observable<AllPostsDataResponse> {
    return this.httpClient.get<AllPostsDataResponse>(
      environment.base_url + `posts?limit=${limit}&page=${page}`,
    );
  }
  createPosts(data: FormData): Observable<CreatePostDataResponse> {
    return this.httpClient.post<CreatePostDataResponse>(environment.base_url + 'posts', data);
  }
  getSinglePost(postId: string | null): Observable<PostDetailsResponse> {
    return this.httpClient.get<PostDetailsResponse>(environment.base_url + 'posts/' + postId);
  }
  getUserPosts(
    userId: string | null,
    limit: number = 40,
    page: number = 1,
  ): Observable<AllPostsDataResponse> {
    return this.httpClient.get<AllPostsDataResponse>(
      environment.base_url + `users/${userId}/posts?limit=${limit}&page=${page}`,
    );
  }
  getHomeFeed(limit: number = 40, page: number = 1): Observable<AllPostsDataResponse> {
    return this.httpClient.get<AllPostsDataResponse>(
      environment.base_url + `/posts/feed?only=following&limit=${limit}&page=${page}`,
    );
  }
  getBookmarks(limit: number = 40, page: number = 1): Observable<BookmarkedPostsDataResponse> {
    return this.httpClient.get<BookmarkedPostsDataResponse>(
      environment.base_url + `users/bookmarks?limit=${limit}&page=${page}`,
    );
  }
  likePost(postId: string): Observable<LikeUnlikePostResponse> {
    return this.httpClient.put<LikeUnlikePostResponse>(
      environment.base_url + `/posts/${postId}/like`,
      {},
    );
  }
  savePost(postId: string): Observable<any> {
    return this.httpClient.put(environment.base_url + `/posts/${postId}/bookmark`, {});
  }
  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(environment.base_url + `posts/${postId}`);
  }
  editPost(postId: string, data: FormData): Observable<any> {
    return this.httpClient.put(environment.base_url + `/posts/${postId}`, data);
  }
  sharePost(postId: string, data: string): Observable<any> {
    return this.httpClient.post(environment.base_url + `/posts/${postId}/share`, {
      body: data,
    });
  }
  getPostLikes(
    postId: string,
    page: number = 1,
    limit: number = 40,
  ): Observable<LikesDataResponse> {
    return this.httpClient.get<LikesDataResponse>(
      environment.base_url + `/posts/${postId}/likes?page=${page}&limit=${limit}`,
    );
  }
  //* update all posts after delete
  updateAllPostsAfterDelete(postId: string): void {
    const updatePosts = (posts: any[]) => posts.filter((item) => item._id != postId);
    this.myPosts.update(updatePosts);
    this.communityPosts.update(updatePosts);
    this.savedPosts.update(updatePosts);
    this.homeFeed.update(updatePosts);
    if (this.postData()._id === postId) {
      this.postData.set({} as PostInfo);
      this.router.navigate(['/feed']);
    }
  }
  //* update all post comments instead of repeating the same logic
  updateAllPostsComments(postId: string, op: number): void {
    const updatePosts = (posts: any[]) =>
      posts.map((item) =>
        item._id === postId ? { ...item, commentsCount: item.commentsCount + op } : item,
      );
    this.myPosts.update(updatePosts);
    this.communityPosts.update(updatePosts);
    this.homeFeed.update(updatePosts);
    this.savedPosts.update(updatePosts);
    this.userPostsData.update(updatePosts);
    this.postData.update((curr) => ({
      ...curr,
      commentsCount: curr.commentsCount + op,
    }));
  }

  updateTopComment(postId: string): void {
    this.getSinglePost(postId).subscribe({
      next: (res) => {
        this.updateTopCommentAfterResponse(postId, res.data.post);
      },
    });
  }
  updateTopCommentAfterResponse(postId: string, post: any): void {
    const updatePosts = (posts: any[]) => posts.map((item) => (item._id === postId ? post : item));
    this.myPosts.update(updatePosts);
    this.communityPosts.update(updatePosts);
    this.homeFeed.update(updatePosts);
    this.savedPosts.update(updatePosts);
    this.userPostsData.update(updatePosts);
    this.postData.update(() => post);
  }

  //* update all posts after creating a new post
  buildNewPost(data: any, myProfileData: MyProfileData): Post {
    return {
      ...data,
      user: {
        _id: myProfileData.user._id,
        name: myProfileData.user.name,
        username: myProfileData.user.username,
        photo: myProfileData.user.photo,
      },
      commentsCount: 0,
      bookmarked: false,
      sharesCount: 0,
    };
  }
  updateAllPostContent(post: Post): void {
    this.myPosts.update((posts) => [post, ...posts]);
    this.communityPosts.update((posts) => [post, ...posts]);
    this.homeFeed.update((posts) => [post, ...posts]);
  }
}
