"use client";

import { DialogTrigger } from "@/components/ui/dialog";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Save, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import fetchAccessToken from "@/lib/fetchAccess";

export function ProjectSettingsDialog({
  project,
  session,
}: {
  project: any;
  session: any;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [organizations, setOrganizations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || "",
    active: project.active,
    organization: project.organization || "",
    airtable_base_id: project.airtable_base_id || "",
    airtable_approval_id: project.airtable_approval_id || "",
    airtable_grant_id: project.airtable_grant_id || "",
    grantAmount: project.grantAmount / 100 || 0,
    airtable_table: project.airtable_table || "",
    airtable_view: project.airtable_view || "",
  });

  useEffect(() => {
    if (open) {
      fetchOrganizations();
    }
  }, [open]);

  const fetchOrganizations = async () => {
    try {
      const accessToken = await fetchAccessToken(session);
      console.log(accessToken);
      const response = await fetch(
        "https://hcb.hackclub.com/api/v4/user/organizations",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setOrganizations(data.orgs || data);
      }
    } catch (error) {
      console.error("Failed to fetch organizations:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace("project-", "")]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      active: checked,
    }));
  };

  const handleOrganizationSelect = (org: string) => {
    setFormData((prev) => ({
      ...prev,
      organization: org,
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace("project-", "")]: Number.parseFloat(value) || 0,
    }));
  };

  const handleSaveChanges = async () => {
    const updatedData = {
      ...formData,
      grantAmount: formData.grantAmount * 100, // Ensure stored in cents
    };

    setIsLoading(true);

    try {
      const response = await fetch("/api/projects/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: project.id, formData: updatedData }),
      });

      if (response.ok) {
        toast({
          title: "Project updated",
          description: "Your project has been updated successfully.",
        });
        setOpen(false);
        router.push(`/dashboard/projects/${project.id}`);
      } else {
        throw new Error("Failed to update project");
      }
    } catch (error) {
      console.error("Failed to update project:", error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/projects/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId: project.id }),
      });

      if (response.ok) {
        toast({
          title: "Project deleted",
          description: "Your project has been deleted successfully.",
        });
        router.push("/dashboard");
        router.refresh();
      } else {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Project Settings</DialogTitle>
            <DialogDescription>
              Configure and manage {project.name}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="general" className="w-full mt-6">
            <TabsList className="mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-status">Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="project-status"
                        checked={formData.active}
                        onCheckedChange={handleSwitchChange}
                      />
                      <Label
                        htmlFor="project-status"
                        className="cursor-pointer"
                      >
                        {formData.active ? "Active" : "Inactive"}
                      </Label>
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Organization Dropdown */}
                  <div className="col-span-2 space-y-2">
                    <Label>Select Organization</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-between"
                        >
                          {organizations.length > 0 && formData.organization
                            ? organizations.find(
                                (organization) =>
                                  organization.slug == formData.organization,
                              )?.name
                            : "Select Organization..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
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
                              {organizations.length > 0 ? (
                                organizations
                                  .filter((org: any) => !org.playground_mode)
                                  .map((org: any) => (
                                    <CommandItem
                                      key={org.id || org.slug}
                                      value={org.name}
                                      onSelect={() =>
                                        handleOrganizationSelect(org.slug)
                                      }
                                    >
                                      {org.name}
                                      <Check
                                        className={cn(
                                          "ml-auto",
                                          formData.organization === org.slug
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                    </CommandItem>
                                  ))
                              ) : (
                                <CommandItem disabled>
                                  Loading organizations...
                                </CommandItem>
                              )}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project-grantAmount">Grant Amount</Label>
                    <Input
                      id="project-grantAmount"
                      type="number"
                      value={formData.grantAmount}
                      onChange={handleNumberInputChange}
                      step="0.01"
                    />
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

                <Separator className="my-4" />

                <h3 className="text-lg font-medium">Airtable Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-airtable_base_id">
                      Airtable Base ID
                    </Label>
                    <Input
                      id="project-airtable_base_id"
                      value={formData.airtable_base_id}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-airtable_table">
                      Airtable Table
                    </Label>
                    <Input
                      id="project-airtable_table"
                      value={formData.airtable_table}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-airtable_view">Airtable View</Label>
                    <Input
                      id="project-airtable_view"
                      value={formData.airtable_view}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-airtable_approval_id">
                      Airtable Approval ID
                    </Label>
                    <Input
                      id="project-airtable_approval_id"
                      value={formData.airtable_approval_id}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-airtable_grant_id">
                      Airtable Grant ID
                    </Label>
                    <Input
                      id="project-airtable_grant_id"
                      value={formData.airtable_grant_id}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="danger" className="space-y-6">
              <div className="rounded-lg border border-destructive/50 p-4">
                <div className="flex flex-col space-y-3">
                  <h3 className="text-lg font-medium flex items-center text-destructive">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Delete Project
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    This will permanently delete the project and all associated
                    data. This action cannot be undone.
                  </p>
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Project
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project &quot;{project.name}&quot; and all associated data including
              automations, logs, and settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
