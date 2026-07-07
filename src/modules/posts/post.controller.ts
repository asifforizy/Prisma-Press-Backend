import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import { postService } from "./post.service";

const createPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;
    const result = await postService.createPosts(payload, id as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully",
      data: result,
    });
  }
);

const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPosts(req.query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Posts retrieved successfully",
      data: result,
    });
  }
);

const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    if (!postId) {
      throw new Error("post id required in params");
    }

    const result = await postService.getPostById(postId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post retrieved successfully",
      data: result,
    });
  }
);

const getPostStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostStatus();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post statistics retrieved successfully",
      data: result,
    });
  }
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const autthorId = req.user?.id;
    const result = await postService.getMyPosts(autthorId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My posts retrieved successfully",
      data: result,
    });
  }
);

const updatePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;
    const Payload = req.body;

    const result = await postService.updatePost(
      postId as string,
      Payload,
      authorId as string,
      isAdmin
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post updated successfully",
      data: result,
    });
  }
);

const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;
    if (!postId) {
      throw new Error("Post id required in params");
    }

    const result = await postService.deletePost(
      postId as string,
      authorId as string,
      isAdmin
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Post deleted successfully",
      data: result,
    });
  }
);

export const postController = {
  createPosts,
  getAllPosts,
  getPostById,
  getPostStatus,
  getMyPosts,
  updatePost,
  deletePost,
};
