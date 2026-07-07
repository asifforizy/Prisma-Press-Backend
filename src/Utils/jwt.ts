import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
        success : true,
        data : verifiedToken
    }
  } catch (error: any) {
    return {
        success : false,
        message : error
    }
  }
};

const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, {expiresIn} as SignOptions);
  return token;
};

export const jwtUtils = {
  verifyToken,
  createToken,
};
