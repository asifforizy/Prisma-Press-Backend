import { Request, Response, Router, NextFunction } from "express";
import { userController } from "./user.controller";
import config from "../../config";
import { jwtUtils } from "../../Utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../Utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { auth } from "../../middleware/auth";

const router = Router();





router.post("/register", userController.registerUser);
router.get("/me", auth(Role.ADMIN, Role.AUTHOR , Role.USER), userController.getMyProfile);
router.put('/my-profile', auth(Role.ADMIN, Role.AUTHOR , Role.USER), userController.updateMyProfile)

export const userRouters = router;
