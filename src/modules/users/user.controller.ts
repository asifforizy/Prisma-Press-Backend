import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../Utils/catchAsync";
import { sendResponse } from "../../Utils/sendResponse";



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

export const userController = {
  registerUser,
};
