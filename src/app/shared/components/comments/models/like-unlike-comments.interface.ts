export interface LikeUnlikeCommentsResponse {
  success: boolean;
  message: string;
  data: LikeUnlikeComments;
}

export interface LikeUnlikeComments {
  liked: boolean;
  likesCount: number;
  comment: Comment;
}

export interface Comment {
  _id: string;
  image: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: string[];
  createdAt: string;
  likesCount: number;
  isReply: boolean;
  id: string;
}

export interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
