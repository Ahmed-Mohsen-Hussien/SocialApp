import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { CommentsRepliesDataResponse } from '../../../shared/components/comments-replies/models/comments-replies-data.interface';
import { CommentsDataResponse } from '../../../shared/components/comments/models/comments-data.interface';
import { CommentsResponse } from '../../models/comments.interface';
import { User } from '../../models/my-profile-data.interface';
import { LikeUnlikeCommentsResponse } from '../../../shared/components/comments/models/like-unlike-comments.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);
  profile: WritableSignal<User> = signal<User>({} as User);
  userId: WritableSignal<string> = signal<string>('');
  getPostComments(postId: string, limit: number, page: number): Observable<CommentsDataResponse> {
    return this.httpClient.get<CommentsDataResponse>(
      environment.base_url + `posts/${postId}/comments?page=${page}&limit=${limit}`,
    );
  }
  createComment(data: object, postId: string): Observable<CommentsResponse> {
    return this.httpClient.post<CommentsResponse>(
      environment.base_url + `posts/${postId}/comments`,
      data,
    );
  }
  createReply(data: object, postId: string, commentId: string): Observable<any> {
    return this.httpClient.post<any>(
      environment.base_url + `posts/${postId}/comments/${commentId}/replies`,
      data,
    );
  }
  getCommentReplies(postId: string, commentId: string): Observable<CommentsRepliesDataResponse> {
    return this.httpClient.get<CommentsRepliesDataResponse>(
      environment.base_url + `posts/${postId}/comments/${commentId}/replies`,
    );
  }
  likeComment(postId: string, commentId: string): Observable<LikeUnlikeCommentsResponse> {
    return this.httpClient.put<LikeUnlikeCommentsResponse>(
      environment.base_url + `posts/${postId}/comments/${commentId}/like`,
      {},
    );
  }
  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(environment.base_url + `posts/${postId}/comments/${commentId}`);
  }
  editComment(postId: string, commentId: string, data: object): Observable<any> {
    return this.httpClient.put<any>(
      environment.base_url + `posts/${postId}/comments/${commentId}`,
      data,
    );
  }
}
