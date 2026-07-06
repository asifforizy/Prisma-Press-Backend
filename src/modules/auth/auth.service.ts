import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IloginUser } from "./auth.interface";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../Utils/jwt";

const loginUser = async (payload: IloginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (user.activeStatus === "BLOCKED") {
      throw new Error("Your account has been blocked. please contact support.");
    }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Passord is incorrect");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtpayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in
  );
  const refreshToken = jwtUtils.createToken(
    jwtpayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  loginUser,
};
