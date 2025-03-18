import { auth } from "../../auth";
import { prisma } from "../db";

export const fetchProjects = async () => {
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  const projects = await prisma.project.findMany({
    where: {
      ownerId: user?.id,
    },
    include: {
      automations: true,
    },
  });

  return projects;
};

export const fetchProject = async (id: string) => {
  const session = await auth();
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  const project = await prisma.project.findFirst({
    where: {
      id,
      ownerId: user?.id,
    },
    include: {
      automations: true,
    },
  });

  return project;
};
