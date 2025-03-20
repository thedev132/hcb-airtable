"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { PlusCircle, ExternalLink, ChevronDown, ChevronUp, X, Plus } from "lucide-react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { createProject } from "@/lib/project/create"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function CreateProjectModal(data: {
  orgs: [{ name: string; id: string; playground_mode: boolean; slug: string }]
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState(0)
  const [airtableBase, setAirtableBase] = useState("")
  const [airtableApproval, setAirtableApproval] = useState("")
  const [airtableGrant, setAirtableGrant] = useState("")
  const [airtableTable, setAirtableTable] = useState("")
  const [airtableView, setAirtableView] = useState("")
  const [open, setOpen] = useState(false)
  const [organization, setOrg] = useState({ name: "", id: "" })
  const [openDialog, setOpenDialog] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const [merchantLocks, setMerchantLocks] = useState<string[]>([])
  const [categoryLocks, setCategoryLocks] = useState<string[]>([])
  const [keywordLock, setKeywordLock] = useState("")
  const [grantPurpose, setGrantPurpose] = useState("")

  const [newMerchantLock, setNewMerchantLock] = useState("")
  const [newCategoryLock, setNewCategoryLock] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(name, description, amount, organization, airtableBase, airtableApproval, airtableGrant)
    const selectedOrg = data.orgs.find((org) => org.id == organization.id)
    if (selectedOrg) {
      createProject(
        name,
        description,
        amount * 100,
        selectedOrg.slug,
        airtableBase,
        airtableApproval,
        airtableGrant,
        airtableTable,
        airtableView,
        merchantLocks,
        categoryLocks,
        keywordLock,
        grantPurpose,
      )
      setOpenDialog(false)
      setName("")
      setDescription("")
      setAmount(0)
      setAirtableBase("")
      setAirtableApproval("")
      setAirtableGrant("")
      setAirtableTable("")
      setAirtableView("")
      setOrg({ name: "", id: "" })
      setMerchantLocks([])
      setCategoryLocks([])
      setKeywordLock("")
      setGrantPurpose("")
      setShowAdvanced(false)
    } else {
      console.error("Selected organization not found")
    }
  }

  const addMerchantLock = () => {
    if (newMerchantLock.trim() !== "") {
      setMerchantLocks([...merchantLocks, newMerchantLock.trim()])
      setNewMerchantLock("")
    }
  }

  const removeMerchantLock = (index: number) => {
    setMerchantLocks(merchantLocks.filter((_, i) => i !== index))
  }

  const addCategoryLock = () => {
    if (newCategoryLock.trim() !== "") {
      setCategoryLocks([...categoryLocks, newCategoryLock.trim()])
      setNewCategoryLock("")
    }
  }

  const removeCategoryLock = (index: number) => {
    setCategoryLocks(categoryLocks.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Fill in the details below to create a new project.</DialogDescription>
        </DialogHeader>

        <div className="bg-muted/40 rounded-lg p-3 mb-3 flex items-start gap-2">
          <ExternalLink className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium">Need help setting up your project?</h4>
            <p className="text-sm text-muted-foreground">
              Check our{" "}
              <a
                href="https://docs.example.com/project-setup"
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                project setup guide
              </a>{" "}
              for detailed information about each field and best practices.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          {/* Name */}
          <div className="space-y-1">
            <Label htmlFor="name">Project Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            <p className="text-xs text-muted-foreground">A clear, descriptive name for your project</p>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <Label htmlFor="amount">Grant Amount</Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) =>
                setAmount(Number.isNaN(Number.parseInt(e.target.value)) ? 0 : Number.parseInt(e.target.value))
              }
              className="col-span-3"
            />
            <p className="text-xs text-muted-foreground">The total funding amount in dollars (no cents)</p>
          </div>

          {/* Description (Full-width) */}
          <div className="col-span-2 space-y-1">
            <Label htmlFor="description">Project Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <p className="text-xs text-muted-foreground">Provide details about the purpose and scope of this project</p>
          </div>

          {/* Organization Dropdown (Full-width) */}
          <div className="col-span-2 space-y-1">
            <Label>Select Organization</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {organization.name || "Select Organization..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search Organizations" className="h-9" />
                  <CommandList>
                    <CommandEmpty>No organizations found.</CommandEmpty>
                    <CommandGroup>
                      {data.orgs.error == undefined
                        ? data.orgs
                            .filter((org) => !org.playground_mode)
                            .map((org) => (
                              <CommandItem
                                key={org.id}
                                value={org.name}
                                onSelect={() => {
                                  setOrg(org)
                                  setOpen(false)
                                }}
                              >
                                {org.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    organization.name === org.name ? "opacity-100" : "opacity-0",
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
            <p className="text-xs text-muted-foreground">The organization associated with this project</p>
          </div>

          <Separator className="col-span-2 my-1" />

          <div className="col-span-2">
            <h3 className="text-base font-medium mb-1">Airtable Configuration</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Connect your project to Airtable to manage grants and approvals.
              <Button variant="link" className="h-auto p-0 text-sm" asChild>
                <a href="https://docs.example.com/airtable-setup" target="_blank" rel="noopener noreferrer">
                  View setup guide
                </a>
              </Button>
            </p>
          </div>

          {/* Airtable Fields (Reorganized for Better Flow) */}
          <div className="space-y-1">
            <Label htmlFor="airtableBase">Airtable Base</Label>
            <Input id="airtableBase" value={airtableBase} onChange={(e) => setAirtableBase(e.target.value)} />
            <p className="text-xs text-muted-foreground">
              The unique identifier for your Airtable base, found in the API documentation
            </p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="airtableTable">Airtable Table</Label>
            <Input id="airtableTable" value={airtableTable} onChange={(e) => setAirtableTable(e.target.value)} />
            <p className="text-xs text-muted-foreground">The name of the table containing your grant data</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="airtableApproval">Airtable Approval</Label>
            <Input
              id="airtableApproval"
              value={airtableApproval}
              onChange={(e) => setAirtableApproval(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Field ID for the approval status column</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="airtableGrant">Airtable Grant</Label>
            <Input id="airtableGrant" value={airtableGrant} onChange={(e) => setAirtableGrant(e.target.value)} />
            <p className="text-xs text-muted-foreground">Field ID for the grant identifier column</p>
          </div>
          <div className="col-span-2 space-y-1">
            <Label htmlFor="airtableView">Airtable View</Label>
            <Input id="airtableView" value={airtableView} onChange={(e) => setAirtableView(e.target.value)} />
            <p className="text-xs text-muted-foreground">The specific view to use for filtering records</p>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="col-span-2 mt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full flex justify-between"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <span>Advanced Settings</span>
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Advanced Settings Section */}
          {showAdvanced && (
            <>
              <Separator className="col-span-2 my-2" />

              <div className="col-span-2">
                <h3 className="text-base font-medium mb-1">Card Restrictions & Purpose</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Configure additional restrictions and purpose for this grant
                </p>
              </div>

              {/* Merchant Locks */}
              <div className="col-span-2 space-y-1">
                <Label htmlFor="merchantLocks">Merchant Locks</Label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {merchantLocks.map((merchant, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {merchant}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeMerchantLock(index)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newMerchantLock"
                    value={newMerchantLock}
                    onChange={(e) => setNewMerchantLock(e.target.value)}
                    placeholder="Add merchant (e.g., Amazon)"
                    className="flex-1"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={addMerchantLock}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Restrict card usage to specific merchants (leave empty for no restrictions)
                </p>
              </div>

              {/* Category Locks */}
              <div className="col-span-2 space-y-1 mt-2">
                <Label htmlFor="categoryLocks">Category Locks</Label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {categoryLocks.map((category, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {category}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeCategoryLock(index)} />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newCategoryLock"
                    value={newCategoryLock}
                    onChange={(e) => setNewCategoryLock(e.target.value)}
                    placeholder="Add category (e.g., Office Supplies)"
                    className="flex-1"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={addCategoryLock}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Restrict card usage to specific categories (leave empty for no restrictions)
                </p>
              </div>

              {/* Keyword Lock */}
              <div className="col-span-2 space-y-1 mt-2">
                <Label htmlFor="keywordLock">Keyword Lock</Label>
                <Input
                  id="keywordLock"
                  value={keywordLock}
                  onChange={(e) => setKeywordLock(e.target.value)}
                  placeholder="Enter keywords separated by commas"
                />
                <p className="text-xs text-muted-foreground">
                  Restrict card usage based on keywords in transaction descriptions
                </p>
              </div>

              {/* Grant Purpose */}
              <div className="col-span-2 space-y-1 mt-2">
                <Label htmlFor="grantPurpose">Grant Purpose</Label>
                <Textarea
                  id="grantPurpose"
                  value={grantPurpose}
                  onChange={(e) => setGrantPurpose(e.target.value)}
                  placeholder="Describe the purpose of this grant"
                  className="min-h-[100px]"
                />
                <p className="text-xs text-muted-foreground">
                  Provide a detailed description of what this grant is intended to fund
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

