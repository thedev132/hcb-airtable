import { getServerSession } from "next-auth";
import { prisma } from "../db";
import { authOptions } from "../auth";

export const deleteProject = async (projectId: string) => {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  const projects = await prisma.project.delete({
    where: {
      ownerId: user?.id,
      id: projectId,
    },
  });

  return projects;
};
