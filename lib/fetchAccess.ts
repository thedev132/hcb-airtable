"use server";
import { prisma } from "./db";

const fetchAccessToken = async (session) => {
  console.log(session);
  const user = await prisma.user.findFirst({
    where: {
      email: session.data?.user?.email ?? undefined,
    },
  });
  console.log(user);
  return user?.access_token;
};

export default fetchAccessToken;
