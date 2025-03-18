"use server";
import { prisma } from "./db";

const fetchAccessToken = async (session) => {
  console.log("session", session);
  const user = await prisma.user.findFirst({
    where: {
      email: session.user?.email ?? undefined,
    },
  });
  console.log(user);
  return user?.access_token;
};

export default fetchAccessToken;
