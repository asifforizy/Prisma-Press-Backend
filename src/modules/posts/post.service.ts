import { title } from "node:process";
import { Role } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IPostQuery } from "../comments/comments.interface";
import { ICreatePostPayload, IupdatedPayload } from "./post.interface";

const createPosts = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async (query: IPostQuery) => {
  const result = await prisma.post.findMany({
    where: {
      AND: [
        query.searchTerm
          ? {
              OR: [
                {
                  title: {
                    contains: query.searchTerm,
                    mode: "insensitive",
                  },
                },
                {
                  content: {
                    contains: query.searchTerm,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},

        query.title
          ? {
              title: {
                equals: query.title,
                mode: "insensitive",
              },
            }
          : {},

        query.content
          ? {
              content: {
                contains: query.content,
                mode: "insensitive",
              },
            }
          : {},
      ],
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      author: {
        omit: {
          password: true,
        },
      },
    },
  });

  return result;
};

const getPostById = async (postId: string) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
    });

    const updatedPost = await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: true,
      },
    });

    return updatedPost;
  });

  return result;
};

const getPostStatus = async () => {
  const totalPosts = await prisma.post.count();

  const publishedPosts = await prisma.post.count({
    where: {
      status: "PUBLISHED",
    },
  });

  const draftPosts = await prisma.post.count({
    where: {
      status: "DRAFT",
    },
  });

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
  };
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: { omit: { password: true } },
      comments: true,
      _count: { select: { comments: true } },
    },
  });

  return result;
};

const updatePost = async (
  postId: string,
  payload: IupdatedPayload,
  authorId: string,
  isAdmin: boolean
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post.");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: { omit: { password: true } },
      comments: true,
      _count: { select: { comments: true } },
    },
  });

  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not authorized to update this post.");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });

  return null;
};

export const postService = {
  createPosts,
  getAllPosts,
  getPostById,
  getPostStatus,
  getMyPosts,
  updatePost,
  deletePost,
};
