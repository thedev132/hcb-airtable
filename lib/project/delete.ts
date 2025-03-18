import { auth } from "../../auth";
import { prisma } from "../db";

export const deleteProject = async (projectId: string) => {
  const session = await auth();
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
