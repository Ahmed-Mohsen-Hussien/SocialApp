export interface LikeUnlikePostResponse {
  success: boolean;
  message: string;
  data: LikeUnlikePost;
}

export interface LikeUnlikePost {
  liked: boolean;
  likesCount: number;
  post: Post;
}

export interface Post {
  _id: string;
  body: string;
  privacy: string;
  user: User;
  sharedPost: any;
  likes: string[];
  createdAt: string;
  likesCount: number;
  isShare: boolean;
  id: string;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
