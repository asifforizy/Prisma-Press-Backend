import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IloginUser } from "./auth.interface";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";


const loginUser = async (payload: IloginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

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

 

    const accessToken = jwt.sign(jwtpayload, config.jwt_access_secret!, { expiresIn: config.jwt_access_expires_in } as SignOptions);

    const refreshToken = jwt.sign(jwtpayload,config.jwt_refresh_secret!,{expiresIn: config.jwt_refresh_expires_in} as SignOptions)

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  loginUser,
};
