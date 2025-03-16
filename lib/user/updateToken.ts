"use server";
import { getServerSession } from "next-auth";
import { prisma } from "../db";
import { authOptions } from "../auth";

const createProject = async (airtablePAT: string) => {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.update({
    where: {
      email: session?.user?.email ?? "",
    },
    data: {
      airtable_pat: airtablePAT,
    },
  });

  return user;
};

export default createProject;
