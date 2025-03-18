"use server";
import { auth } from "../../auth";
import { prisma } from "../db";

const createProject = async (airtablePAT: string) => {
  const session = await auth();

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
