import { Request, Response } from "express";
import { catchAsync } from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { commentService } from "./comments.service";
import { Role } from "../../../generated/prisma/enums";

const createComment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await commentService.createComment(req.body, userId as string);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Comment created successfully",
    data: result,
  });
});

const getCommentByAuthorId = catchAsync(async (req: Request, res: Response) => {
  const { authorId } = req.params;

  const result = await commentService.getCommentByAuthorId(authorId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Comments retrieved successfully",
    data: result,
  });
});

const getCommentByCommentId = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params;

  const result = await commentService.getCommentByCommentId(commentId as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Comment retrieved successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params;

  const userId = req.user?.id ;
  const isAdmin = req.user?.role === "ADMIN";

  const result = await commentService.updateComment(
    commentId as string,
    req.body,
    userId  as string,
    isAdmin
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params;

  const userId = req.user?.id;
  const isAdmin = req.user?.role === "ADMIN";

  await commentService.deleteComment(commentId as string, userId as string, isAdmin);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Comment deleted successfully",
    data: null,
  });
});

const moderateComment = catchAsync(async (req: Request, res: Response) => {
  const { commentId } = req.params;

  const result = await commentService.moderateComment(commentId as string );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Comment moderated successfully",
    data: result,
  });
});

export const commentController = {
  createComment,
  getCommentByAuthorId,
  getCommentByCommentId,
  updateComment,
  deleteComment,
  moderateComment,
};