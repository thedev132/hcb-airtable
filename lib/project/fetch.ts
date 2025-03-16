import { getServerSession } from "next-auth";
import { prisma } from "../db";
import { authOptions } from "../auth";

export const fetchProjects = async () => {
  const session = await getServerSession(authOptions);
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
  const session = await getServerSession(authOptions);
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
