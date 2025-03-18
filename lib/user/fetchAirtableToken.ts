"use server";
import { auth } from "../../auth";
import { prisma } from "../db";

const createProject = async () => {
  const session = await auth();

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  return user?.airtable_pat;
};

export default createProject;
