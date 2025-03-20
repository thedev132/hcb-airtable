import fetchAccessToken from "@/lib/fetchAccess"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import AutomationLogModalClient from "./automation-log-modal-client"

interface AutomationLogModalProps {
  log: any
  project: any
}

export default async function AutomationLogModal({ log, project }: AutomationLogModalProps) {
  const session = await auth()
  const accessToken = await fetchAccessToken(session)
  const user = await prisma.user.findFirst({
    where: {
      email: session.user?.email ?? undefined,
    },
  })

  console.log(log.grantId)
  const grantCard = await fetch(`https://hcb.hackclub.com/api/v4/card_grants/${log.grantId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })
  const grantCardData = await grantCard.json()
  console.log(grantCardData)

  return (
    <AutomationLogModalClient
      log={log}
      project={project}
      session={session}
      accessToken={accessToken}
      user={user}
      grantCardData={grantCardData}
    />
  )
}

