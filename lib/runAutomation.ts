"use server";
import { getServerSession } from "next-auth";
import { prisma } from "./db";
import { authOptions } from "./auth";
import Airtable from "airtable";

const runAutomation = async (projectId: string) => {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  const project = await prisma.project.findFirst({
    where: {
      ownerId: user?.id,
      id: projectId,
    },
    include: {
      automations: true,
    },
  });
  console.log(project);
  console.log(user);

    if (user?.airtable_pat) {
      let base = new Airtable({ apiKey: user.airtable_pat }).base(
        project.airtable_base_id,
      );
      base(project.airtable_table)
        .select({
          view: project.airtable_view,
        })
        .eachPage(
          async function page(records, fetchNextPage) {
            records.forEach(async function (record) {
              const isApproved = record.get(project.airtable_approval_id);
              const isGrantSent = record.get(project.airtable_grant_id);
              if ((isApproved || isApproved == "Approved") && !isGrantSent) {
                console.log("Sending grant to " + record.get("First Name"));
                const email = record.get("Email");
                const response = await fetch(`https://hcb.hackclub.com/api/v4/organizations/${project.organization}/card_grants`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        amount_cents: project.grantAmount,
                        merchant_lock: "",
                        category_lock: "",
                        keyword_lock: ""
                    }),
                });
                let data = await response.json();
                record.patchUpdate({
                  [project.airtable_grant_id]: true,
                });
                prisma.automation.create({
                  data: {
                    projectId: project.id,
                    recieverEmail: email ? email.toString() : "",
                    recieverName:
                      record.get("First Name") + " " + record.get("Last Name"),
                    recieverId: record.id,
                    name: `Grant to ${record.get("First Name") + " " + record.get("Last Name")}`,
                    status: response.ok ? "Success" : "Failed",
                  },
                });
              }
            });
            fetchNextPage();
          },
          function done(err) {
            if (err) {
              console.error(err);
              return;
            }
          },
        );
    }

  return user?.airtable_pat;
};

export default runAutomation;
