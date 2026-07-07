import { prisma } from "../../lib/prisma";

const createComment = async (payload: any, user: any) => {
  const result = await prisma.comment.create({
    data: {
      content: payload.content,
      postId: payload.postId,
      authorId: user.id,
    },
  });

  return result;
};

const getCommentByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
    include: {
      author: true,
      post: true,
    },
    orderBy: {
      id: "desc",
    },
  });

  return result;
};

const getCommentByCommentId = async (commentId: string) => {
  const result = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    include: {
      author: true,
      post: true,
    },
  });

  return result;
};

const updateComment = async (
  commentId: string,
  payload: any,
  user: any
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  if (user.role !== "ADMIN" && comment.authorId !== user.id) {
    throw new Error("You are not authorized to update this comment.");
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: payload,
  });

  return result;
};

const deleteComment = async (
  commentId: string,
  user: any
) => {
  const comment = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
  });

  if (user.role !== "ADMIN" && comment.authorId !== user.id) {
    throw new Error("You are not authorized to delete this comment.");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return null;
};

const moderateComment = async (
  commentId: string,
  payload: any
) => {
  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      status: payload.status,
    },
  });

  return result;
};

export const commentService = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};