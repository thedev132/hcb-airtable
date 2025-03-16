import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Code2,
  FileText,
  Settings,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchProject } from "@/lib/project/fetch";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { ProjectSettingsDialog } from "@/components/project-settings-dialog";
import handleAutomationRun from "@/lib/automation";
import RunAutomationButton from "@/components/runAutomationButton";

export default async function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }


  // In a real app, you would fetch this data from your database
  const project = await fetchProject(params.id);
  const successRate = Math.floor(
    (project.automations.filter((a) => a.status === "Success").length /
      project.automations.length) *
      100,
  );

  //   fetch last automation and get the time ago using date fns
  console.log(project?.automations);
  const lastRun =
    project?.automations?.length > 0 ? project.automations[0].createdAt : "N/A";
  const timeAgo =
    lastRun != "N/A"
      ? formatDistanceToNow(new Date(lastRun), {
          addSuffix: true,
        })
      : "N/A";

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-auto">
      <div className="flex justify-between items-center p-6 border-b">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {project?.name}
            </h2>
            <Badge variant={project?.active ? "success" : "warning"}>
              {project?.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{project?.description}</p>
        </div>
        <div className="flex gap-2">
          <ProjectSettingsDialog project={project} session={session} />
          {project?.id && <RunAutomationButton projectId={project.id} />}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {project?.automations.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Across this project
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Number.isNaN(successRate) ? "N/A" : successRate + "%"}
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Last Activity
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timeAgo}</div>
              <p className="text-xs text-muted-foreground">Most recent run</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="logs" className="w-full">
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Automation Logs</CardTitle>
                <CardDescription>
                  View the most recent automation runs and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="w-[300px]">Message</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project?.automations?.length > 0 ? (
                      project?.automations.map((automation) => (
                        <TableRow key={automation.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(automation.status)}
                              <span className="ml-2 capitalize">
                                {automation.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {automation.name}
                          </TableCell>
                          <TableCell>
                            {formatDate(automation.createdAt.toDateString())}
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">
                            {automation.name}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No automations found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
