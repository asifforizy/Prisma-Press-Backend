import { prisma } from "../../lib/prisma";
import { ICreateCommentPayload, IUpdateCommentPayload } from "./comments.interface";

const createComment = async (
  payload: ICreateCommentPayload,
  authorId: string
) => {
  return prisma.comment.create({
    data: {
      ...payload,
      authorId,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
};

const getCommentByAuthorId = async (authorId: string) => {
  return prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      post: true,
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
};

const getCommentByCommentId = async (commentId: string) => {
  return prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    include: {
      post: true,
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
};

const updateComment = async (
  commentId: string,
  payload: IUpdateCommentPayload,
  authorId: string,
  isAdmin: boolean
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  if (!isAdmin && comment.authorId !== authorId) {
    throw new Error("You are not authorized to update this comment.");
  }

  return prisma.comment.update({
    where: {
      id: commentId,
    },
    data: payload,
    include: {
      post: true,
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
};

const deleteComment = async (
  commentId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  if (!isAdmin && comment.authorId !== authorId) {
    throw new Error("You are not authorized to delete this comment.");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return null;
};

const moderateComment = async (commentId: string) => {
  return prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      isModerated: true,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      post: true,
    },
  });
};

export const commentService = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};