export interface CommentsResponse {
  success: boolean;
  message: string;
  data: Comments;
}

export interface Comments {
  comment: Comment;
}

export interface Comment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  post: string;
  parentComment: any;
  likes: any[];
  createdAt: string;
  likesCount: number;
  isReply: boolean;
  id: string;
  repliesCount: number;
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
