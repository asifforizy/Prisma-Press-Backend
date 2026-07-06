import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../Utils/catchAsync";



const registerUser = catchAsync(async (req: Request, res: Response , next: NextFunction) => {
  const payload = req.body;
  const user = await userService.registeruserIntoDB(payload);
  res.status(httpStatus.CREATED).json({
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: {
      user,
    },
  });
});

export const userController = {
  registerUser,
};
