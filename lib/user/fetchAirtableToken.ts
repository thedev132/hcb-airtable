"use server";
import { getServerSession } from "next-auth";
import { prisma } from "../db";
import { authOptions } from "../auth";

const createProject = async () => {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  return user?.airtable_pat;
};

export default createProject;
