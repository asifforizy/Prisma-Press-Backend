import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";
import jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../Utils/jwt";
import { Payload } from "../../../generated/prisma/internal/prismaNamespace";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registeruserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user register successfully",
      data: { user },
    });
  }
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const profile = await userService.getmyProfileFromDB(
      req.user?.id as string
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User profile fetch successfully",
      data: { profile },
    });
  }
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    const payload = req.body;
    const updatedProfile = await userService.updatemyprofileInDB(
      userId,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "user profile updated successfully",
      data: { updatedProfile },
    });
  }
);

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
