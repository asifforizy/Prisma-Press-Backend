import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";

export interface ICreateCommentPayload {
  postId: string;
  content: string;
}

export interface IUpdateCommentPayload {
  content?: string;
}



export interface IPostQuery extends Partial<Post> {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortBy?: keyof Post;
  sortOrder?: "asc" | "desc";
}