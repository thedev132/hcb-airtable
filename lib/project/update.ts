import { getServerSession } from "next-auth";
import { prisma } from "../db";
import { authOptions } from "../auth";
import { Prisma } from "@prisma/client";

export const updateProject = async (
  id: string,
  updates: Partial<Prisma.ProjectUpdateInput>,
) => {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...updates,
      ownerId: user.id,
    } as Prisma.ProjectUpdateInput,
  });

  return project;
};
