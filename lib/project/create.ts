"use server";
import { auth } from "../../auth";
import { prisma } from "../db";

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
  merchantLocks: string[],
  categoryLocks: string[],
  keywordLock: string,
  grantPurpose: string,
) => {
  const session = await auth();
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
      merchant_locks: merchantLocks,
      category_locks: categoryLocks,
      keyword_lock: keywordLock,
      grant_purpose: grantPurpose,
    },
  });

  return project;
};
