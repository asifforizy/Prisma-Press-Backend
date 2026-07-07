import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IloginUser } from "./auth.interface";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../Utils/jwt";
import { JwtPayload } from 'jsonwebtoken';

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





const refreshToken = async (refreshToken : string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken,config.jwt_refresh_secret)
  if(!verifiedRefreshToken.success){
    throw new Error (verifiedRefreshToken.message)
  }

  const {id} = verifiedRefreshToken.data as JwtPayload
  const user = await prisma.user.findUniqueOrThrow({
    where:{id}
  })


  if(user.activeStatus === "BLOCKED"){
    throw new Error("USer is blocked")

    
  }


  const JwtPayload = {
      id,
      name: user.name,
      email:user.email,
      role:user.role
    }


    const accessToken = jwtUtils.createToken(JwtPayload,config.jwt_access_secret,config.jwt_access_expires_in )

    return{ accessToken}

}





export const authService = {
  loginUser,
  refreshToken
};
