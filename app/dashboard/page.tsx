import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import CreateProjectModal from "@/components/create-project";
import fetchAccessToken from "@/lib/fetchAccess";
import { fetchProjects } from "@/lib/project/fetch";
import Link from "next/link";
import {
  PlusCircle,
  BarChart3,
  Clock,
  Activity,
  ArrowUpRight,
  Filter,
  FolderKanban,
  ArrowRight,
  CheckCircle,
  XCircle,
  Calendar,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import RunAutomationButton from "@/components/runAutomationButton";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  console.log(session);

  if (!session) {
    redirect("/login");
  }

  const accessToken = await fetchAccessToken(session);
  console.log(accessToken);
  const projects = await fetchProjects();
  const activeProjects = projects.filter((project) => project.active === true);
  const totalAutomations = projects.reduce(
    (acc, project) => acc + project.automations.length,
    0,
  );
  const successRate = projects.reduce(
    (acc, project) =>
      acc +
      (project.automations.length > 0
        ? (project.automations.filter(
            (automation) => automation.status === "Success",
          ).length /
            project.automations.length) *
          100
        : 0),
    0,
  );
  const successfullAutomations = projects.reduce(
    (acc, project) =>
      acc +
      project.automations.filter(
        (automation) => automation.status === "Success",
      ).length,
    0,
  );

  const response = await fetch(
    "https://hcb.hackclub.com/api/v4/user/organizations",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ContentType: "application/json",
      },
    },
  );

  console.log(response);
  const data = await response.json();

  return (
    <div className="flex flex-col h-full w-full overflow-auto">
      <div className="flex justify-between items-center p-6 border-b">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome, {session.user?.name || "User"}!
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your projects and automations
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Project Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Projects
              </CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Out of {projects.length} total projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Automations Ran
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAutomations}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Total automation executions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Success Rate
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {successfullAutomations} successful of {totalAutomations} total
                runs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Your Projects</h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <CreateProjectModal orgs={data} />
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-0">
              <div
                className={`grid ${projects.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"} gap-6`}
              >
                {projects.map((project, index) => (
                  <ProjectCard key={index} project={project} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active" className="space-y-0">
              <div
                className={`grid ${activeProjects.length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"} gap-6`}
              >
                {activeProjects.map((project, index) => (
                  <ProjectCard key={index} project={project} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="inactive" className="space-y-0">
              <div
                className={`grid ${projects.filter((p) => !p.active).length === 1 ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"} gap-6`}
              >
                {projects
                  .filter((p) => !p.active)
                  .map((project, index) => (
                    <ProjectCard key={index} project={project} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Recent Activity Section */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.slice(0, 3).map((project, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="bg-muted rounded-full p-2">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{project.name}</h4>
                      <Badge variant={project.active ? "default" : "secondary"}>
                        {project.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {project.description || "No description provided"}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>
                        Created:{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      {project.updatedAt && (
                        <span>
                          • Updated:{" "}
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="ghost" className="ml-auto" size="sm">
              View All Activity
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card> */}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FolderKanban className="h-6 w-6" />
              {project.name}
            </CardTitle>
            <CardDescription className="text-base">
              {project.description || "No description provided"}
            </CardDescription>
          </div>
          <Badge
            variant={project.active ? "success" : "warning"}
            className="text-sm px-3 py-1"
          >
            {project.active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Total Runs</span>
            <span className="text-2xl font-bold">
              {project.automations.length || 0}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Success Rate</span>
            <span className="text-2xl font-bold">
              {project.automations && project.automations.length > 0
                ? (project.automations.filter(
                    (automation) => automation.status === "Success",
                  ).length /
                    project.automations.length) *
                  100
                : 0}
              %
            </span>
          </div>
          <div className="flex flex-col md:col-span-2">
            <span className="text-sm text-muted-foreground">Last Run</span>
            <span
              className={`text-2xl font-bold ${
                project.automations?.length > 0
                  ? formatDistanceToNow(
                      new Date(
                        project.automations[
                          project.automations.length - 1
                        ].createdAt,
                      ),
                      { addSuffix: true },
                    ).length > 10
                    ? "text-xl"
                    : "text-3xl"
                  : "text-lg"
              }`}
            >
              {project.automations?.length > 0
                ? formatDistanceToNow(
                    new Date(
                      project.automations[
                        project.automations.length - 1
                      ].createdAt,
                    ),
                    { addSuffix: true },
                  )
                : "N/A"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Automations */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Recent Automations
            </h4>
            <div className="space-y-3">
              {project.automations.length > 0 ? (
                project.automations.slice(0, 2).map((automation) => (
                  <div
                    key={automation.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      {automation.status === "Success" ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                      <span className="font-medium text-sm">
                        {automation.name}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {automation.createdAt.toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                        timeZone:
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                      })}{" "}
                      at{" "}
                      {automation.createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone:
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-6 bg-muted/50 rounded-md text-center py-11">
                  <Activity className="h-8 w-8 mb-2 text-muted-foreground opacity-40" />
                  <p className="text-sm font-medium">No automations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <FolderKanban className="h-4 w-4 mr-2" />
              Project Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Created</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString([], {
                      timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    })}{" "}
                    at{" "}
                    {new Date(project.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Overview</div>
                  <div className="text-xs text-muted-foreground">
                    Sending ${project.grantAmount / 100} per project from{" "}
                    {project.organization
                      .replace(/-/g, " ")
                      .split(" ")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")}
                    's HCB
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex gap-3">
        <Button asChild variant="default" className="flex-1">
          <Link href={`/dashboard/projects/${project.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <RunAutomationButton type="home" projectId={project.id} />
      </CardFooter>
    </Card>
  );
}
