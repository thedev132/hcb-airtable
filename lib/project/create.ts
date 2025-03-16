"use server";
import { getServerSession } from "next-auth";
import { prisma } from "../db";
import { authOptions } from "../auth";

export const createProject = async (
  name: string,
  description: string,
  amount: number,
  organization: string,
  airtableBase: string,
  airtableApprove: string,
  airtableGrant: string,
  airtableTable: string,
  airtableView: string,
) => {
  // const session = unstable_getServerSession
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });
  const project = await prisma.project.create({
    data: {
      name,
      description,
      grantAmount: amount,
      airtable_base_id: airtableBase,
      airtable_approval_id: airtableApprove,
      airtable_grant_id: airtableGrant,
      airtable_table: airtableTable,
      airtable_view: airtableView,
      ownerId: user?.id ?? "",
      organization,
    },
  });

  return project;
};
