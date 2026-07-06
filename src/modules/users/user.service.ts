import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";
import {
  Payload,
  Either,
} from "../../../generated/prisma/internal/prismaNamespace";

const registeruserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, profilePhoto } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    throw new Error("user ready exists with this email");
  }

  const hashedPasswod = await bcrypt.hash(
    password,
    Number(config.bycrypt_salt)
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPasswod,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: { password: true },
    include: { profile: true },
  });

  return user;
};

const getmyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: { password: true },
    include: { profile: true },
  });

  return user;
};

const updatemyprofileInDB = async (userId: string, Payload: any) => {
  const { name, email, profilePhoto, bio } = Payload;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      profile: {
        update: {
          bio,
          profilePhoto,
        },
      },
    },
    omit: { password: true },
    include: { profile: true },
  });


  return updatedUser;
};

export const userService = {
  registeruserIntoDB,
  getmyProfileFromDB,
  updatemyprofileInDB
};
