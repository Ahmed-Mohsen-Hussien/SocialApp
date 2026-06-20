export interface LikesDataResponse {
  success: boolean;
  message: string;
  data: LikesData;
  meta: Meta;
}

export interface LikesData {
  likes: Like[];
}

export interface Like {
  _id: string;
  name: string;
  username: string;
  photo: string;
  followersCount: number;
  followingCount: number;
  bookmarksCount: number;
  id: string;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
}
