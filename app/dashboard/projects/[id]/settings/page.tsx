import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { fetchProject } from "@/lib/project/fetch";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Save,
  Trash2,
  Users,
  Bell,
  Globe,
  Shield,
  Database,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandInput,
  CommandGroup,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import fetchAccessToken from "@/lib/fetchAccess";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";

export default async function ProjectSettingsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch project data
  const project = await fetchProject(params.id);
  const accessToken = await fetchAccessToken(session);
  const selectedOrg = project?.organization;
  console.log(accessToken);

  if (!project) {
    notFound();
  }

  const response = await fetch(
    "https://hcb.hackclub.com/api/v4/user/organizations",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json();
  console.log(data);

  return (
    <div className="flex flex-col h-full w-full overflow-auto">
      <div className="flex items-center p-6 border-b">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href={`/dashboard/projects/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Project Settings
          </h2>
          <p className="text-muted-foreground mt-1">
            Configure and manage {project.name}
          </p>
        </div>
      </div>

      <div className="p-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            {/* <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger> */}
            <TabsTrigger value="danger">Danger Zone</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
                <CardDescription>
                  Update your project details and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input id="project-name" defaultValue={project.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-status">Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="project-status"
                        defaultChecked={project.active}
                      />
                      <Label
                        htmlFor="project-status"
                        className="cursor-pointer"
                      >
                        {project.active ? "Active" : "Inactive"}
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      defaultValue={project.description}
                      className="min-h-[100px]"
                    />
                  </div>
                  {/* Organization Dropdown (Full-width) */}
                  <div className="col-span-2 space-y-2">
                    <Label>Select Organization</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                          // onClick={() => {}}
                        >
                          {project.organization || "Select Organization..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search Organizations"
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No organizations found.</CommandEmpty>
                            <CommandGroup>
                              {data.orgs == undefined
                                ? data
                                    .filter((org) => !org.playground_mode)
                                    .map((org) => (
                                      <CommandItem
                                        key={org.id}
                                        value={org.name}
                                      >
                                        {org.name}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            selectedOrg === org.slug
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                      </CommandItem>
                                    ))
                                : null}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-created">Created On</Label>
                    <Input
                      id="project-created"
                      value={format(
                        new Date(project.createdAt),
                        "MMMM d, yyyy",
                      )}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-6">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="notify-success"
                          className="cursor-pointer"
                        >
                          Successful automations
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when automations complete successfully
                        </p>
                      </div>
                      <Switch id="notify-success" defaultChecked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="notify-failure"
                          className="cursor-pointer"
                        >
                          Failed automations
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when automations fail
                        </p>
                      </div>
                      <Switch id="notify-failure" defaultChecked={true} />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="notify-warning"
                          className="cursor-pointer"
                        >
                          Warnings
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about automation warnings
                        </p>
                      </div>
                      <Switch id="notify-warning" defaultChecked={false} />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Webhook Notifications</h3>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input
                      id="webhook-url"
                      placeholder="https://example.com/webhook"
                    />
                    <p className="text-sm text-muted-foreground">
                      We'll send a POST request to this URL when events occur
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Switch id="webhook-enabled" defaultChecked={false} />
                    <Label htmlFor="webhook-enabled" className="cursor-pointer">
                      Enable webhook notifications
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 border-t pt-6">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Team Members
                </CardTitle>
                <CardDescription>
                  Manage who has access to this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Current Members</h3>
                  <Button size="sm">Add Member</Button>
                </div>

                <div className="space-y-4">
                  {/* Owner */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {session.user?.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-medium">{session.user?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <Badge>Owner</Badge>
                  </div>

                  {/* Mock team members */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        A
                      </div>
                      <div>
                        <p className="font-medium">Alex Johnson</p>
                        <p className="text-sm text-muted-foreground">
                          alex@example.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Editor</Badge>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        S
                      </div>
                      <div>
                        <p className="font-medium">Sarah Miller</p>
                        <p className="text-sm text-muted-foreground">
                          sarah@example.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Viewer</Badge>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Pending Invitations</h3>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        M
                      </div>
                      <div>
                        <p className="font-medium">mike@example.com</p>
                        <p className="text-sm text-muted-foreground">
                          Invited 2 days ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Editor</Badge>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  Integrations
                </CardTitle>
                <CardDescription>
                  Connect your project with external services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Database className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Airtable</p>
                        <p className="text-sm text-muted-foreground">
                          Connect to your Airtable bases
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {project.airtable_base_id ? "Connected" : "Connect"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5093-2.6067-1.4997z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Slack</p>
                        <p className="text-sm text-muted-foreground">
                          Send notifications to Slack channels
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">GitHub</p>
                        <p className="text-sm text-muted-foreground">
                          Sync with GitHub repositories
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">API Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Use our API to programmatically access and control your
                    automations
                  </p>
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="api-key"
                        value="••••••••••••••••••••••••••••••"
                        readOnly
                      />
                      <Button variant="outline">Regenerate</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="danger" className="space-y-6">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <Shield className="mr-2 h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  These actions are destructive and cannot be undone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-destructive p-4">
                  <div className="flex flex-col space-y-3">
                    <h3 className="text-lg font-medium">Delete Project</h3>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete the project and all
                      associated data. This action cannot be undone.
                    </p>
                    <div className="flex justify-end">
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Project
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
