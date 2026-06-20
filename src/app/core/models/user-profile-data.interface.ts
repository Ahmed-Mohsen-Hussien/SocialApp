export interface UserProfileDataResponse {
  success: boolean;
  message: string;
  data: UserProfileData;
}
export interface UserProfileData {
  isFollowing: boolean;
  user: User;
}
export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  photo: string;
  cover: string;
  followers: Follower[];
  following: any[];
  createdAt: string;
  passwordChangedAt: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
export interface Follower {
  _id: string;
  name: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}
