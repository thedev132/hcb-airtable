"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  User,
  Mail,
  Calendar,
  Lock,
  ShoppingCart,
  Tag,
  CreditCard,
  Building,
  ArrowRight,
  Edit2,
  Save,
  Plus,
  X,
  Ban,
} from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
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
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "./ui/textarea";
import Link from "next/link";

interface AutomationLogModalClientProps {
  log: any;
  project: any;
  session: any;
  accessToken: string;
  user: any;
  grantCardData: any;
}

export default function AutomationLogModalClient({
  log,
  project,
  accessToken,
  user,
  grantCardData,
}: AutomationLogModalClientProps) {
  const [open, setOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isEditingLocks, setIsEditingLocks] = useState(false);

  // Card details state
  const [cardDetails, setCardDetails] = useState({
    grantId: grantCardData.id,
    cardId: grantCardData.card_id,
    grantAmount: grantCardData.amount_cents / 100,
    recipientName: log.recieverName || "John Doe",
    recipientEmail: log.recieverEmail || "john.doe@example.com",
    sentBy: user?.name || "Admin User",
    sentDate: log.createdAt,
    expiryDate: new Date(
      new Date(log.createdAt).getTime() + 12 * 30 * 24 * 60 * 60 * 1000,
    ), // 1 year from log date
    locks: {
      merchant: grantCardData.allowed_merchants || [],
      category: grantCardData.allowed_categories || [],
      keyword: grantCardData.keyword_lock || "",
    },
    status: grantCardData.status,
    transactionId: "txn_" + Math.random().toString(36).substring(2, 10),
    notes: log.message || "No additional notes.",
  });

  const [editedMerchantLocks, setEditedMerchantLocks] = useState<string[]>([
    ...(grantCardData.allowed_merchants || []),
  ]);
  const [editedCategoryLocks, setEditedCategoryLocks] = useState<string[]>([
    ...(grantCardData.allowed_categories || []),
  ]);
  const [editedKeywordLock, setEditedKeywordLock] = useState(
    grantCardData.keyword_lock || "",
  );
  const [newMerchantLock, setNewMerchantLock] = useState("");
  const [newCategoryLock, setNewCategoryLock] = useState("");
  const [isEditingPurpose, setIsEditingPurpose] = useState(false);
  const [editedPurpose, setEditedPurpose] = useState(cardDetails.notes);

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "failed":
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "failed":
      case "cancelled":
        return "destructive";
      case "warning":
        return "warning";
      default:
        return "success";
    }
  };

  const addMerchantLock = () => {
    if (newMerchantLock.trim() !== "") {
      setEditedMerchantLocks([...editedMerchantLocks, newMerchantLock.trim()]);
      setNewMerchantLock("");
    }
  };

  const removeMerchantLock = (index: number) => {
    setEditedMerchantLocks(editedMerchantLocks.filter((_, i) => i !== index));
  };

  const addCategoryLock = () => {
    if (newCategoryLock.trim() !== "") {
      setEditedCategoryLocks([...editedCategoryLocks, newCategoryLock.trim()]);
      setNewCategoryLock("");
    }
  };

  const removeCategoryLock = (index: number) => {
    setEditedCategoryLocks(editedCategoryLocks.filter((_, i) => i !== index));
  };

  const saveLocks = async () => {
    try {
      // Call the API
      const response = await fetch(
        `https://hcb.hackclub.com/api/v4/card_grants/${log.grantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            merchant_lock: editedMerchantLocks.join(","),
            category_lock: editedCategoryLocks.join(","),
            keyword_lock: editedKeywordLock,
          }),
        },
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to update locks");
      }

      setCardDetails({
        ...cardDetails,
        locks: {
          merchant: editedMerchantLocks,
          category: editedCategoryLocks,
          keyword: editedKeywordLock,
        },
      });

      setIsEditingLocks(false);
      toast({
        title: "Locks updated",
        description: "Card restrictions have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating locks:", error);
      toast({
        title: "Error",
        description: "Failed to update card restrictions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const savePurpose = async () => {
    try {
      // Call the API
      const response = await fetch(
        `https://hcb.hackclub.com/api/v4/card_grants/${log.grantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            purpose: editedPurpose,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update purpose");
      }

      setCardDetails({
        ...cardDetails,
        notes: editedPurpose,
      });

      setIsEditingPurpose(false);
      toast({
        title: "Purpose updated",
        description: "Grant purpose has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating purpose:", error);
      toast({
        title: "Error",
        description: "Failed to update grant purpose. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelEditing = () => {
    setEditedMerchantLocks([...cardDetails.locks.merchant]);
    setEditedCategoryLocks([...cardDetails.locks.category]);
    setEditedKeywordLock(cardDetails.locks.keyword);
    setIsEditingLocks(false);
  };

  const cancelEditingPurpose = () => {
    setEditedPurpose(cardDetails.notes);
    setIsEditingPurpose(false);
  };

  const handleCancelGrant = async () => {
    setIsCancelling(true);

    try {
      // Call the API
      const response = await fetch(
        `https://hcb.hackclub.com/api/v4/card_grants/${log.grantId}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to cancel grant");
      }

      // Update the local state
      setCardDetails({
        ...cardDetails,
        status: "cancelled",
      });

      setCancelDialogOpen(false);
      toast({
        title: "Grant cancelled",
        description: "The grant has been successfully cancelled.",
      });
    } catch (error) {
      console.error("Error cancelling grant:", error);
      toast({
        title: "Error",
        description: "Failed to cancel grant. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {getStatusIcon(cardDetails.status)}
              Automation Log Details
              <Badge
                variant={getStatusVariant(cardDetails.status)}
                className="ml-2 capitalize"
              >
                {cardDetails.status}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Automation: <span className="font-medium">{log.name}</span> •
              Project: <span className="font-medium">{project.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Card Details */}
            <Card className="border-2 border-primary/10 shadow-md">
              <CardHeader className="bg-primary/5 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Virtual Card Details
                  </CardTitle>
                  <div className="flex flex-row gap-4">
                    <Badge variant="outline" className="font-mono text-xs">
                      <Link
                        href={`https://hcb.hackclub.com/grants/${cardDetails.grantId.replace("cdg_", "")}`}
                        target="_blank"
                      >
                        {cardDetails.grantId}
                      </Link>
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Generated on{" "}
                  {format(new Date(cardDetails.sentDate), "MMMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Grant Amount
                      </h3>
                      <p className="text-2xl font-bold">
                        ${cardDetails.grantAmount.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Recipient
                      </h3>
                      <p className="font-medium">{cardDetails.recipientName}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {cardDetails.recipientEmail}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        Sent By
                      </h3>
                      <div className="flex flex-row items-center gap-2">
                        <Avatar className="scale-75">
                          <AvatarImage src={user?.image} />
                        </Avatar>
                        <p className="font-medium">{cardDetails.sentBy}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Expiry Date
                      </h3>
                      <p className="font-medium">
                        {format(
                          new Date(cardDetails.expiryDate),
                          "MMMM d, yyyy",
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />1 year from issue
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1 flex items-center justify-between">
                        <span className="flex items-center">
                          <Lock className="h-4 w-4 mr-1" />
                          Card Locks
                        </span>
                        {!isEditingLocks &&
                        cardDetails.status.toLowerCase() !== "cancelled" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => setIsEditingLocks(true)}
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        ) : isEditingLocks ? (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={cancelEditing}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={saveLocks}
                            >
                              <Save className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                          </div>
                        ) : null}
                      </h3>

                      {!isEditingLocks ? (
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Merchant Locks
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {cardDetails.locks.merchant.length > 0 ? (
                                cardDetails.locks.merchant.map(
                                  (merchant, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {merchant}
                                    </Badge>
                                  ),
                                )
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  None
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              Category Locks
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {cardDetails.locks.category.length > 0 ? (
                                cardDetails.locks.category.map(
                                  (category, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {category}
                                    </Badge>
                                  ),
                                )
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  None
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              Keyword Locks
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {cardDetails.locks.keyword ? (
                                <Badge variant="outline" className="text-xs">
                                  {cardDetails.locks.keyword}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  None
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 bg-muted/30 p-3 rounded-md">
                          {/* Merchant Locks Edit */}
                          <div>
                            <p className="text-xs font-medium flex items-center">
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Merchant Locks
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1 mb-2">
                              {editedMerchantLocks.map((merchant, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs flex items-center gap-1"
                                >
                                  {merchant}
                                  <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => removeMerchantLock(index)}
                                  />
                                </Badge>
                              ))}
                              {editedMerchantLocks.length === 0 && (
                                <span className="text-xs text-muted-foreground italic">
                                  No merchant restrictions
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Input
                                value={newMerchantLock}
                                onChange={(e) =>
                                  setNewMerchantLock(e.target.value)
                                }
                                placeholder="Add merchant (e.g., Amazon)"
                                className="h-7 text-xs"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2"
                                onClick={addMerchantLock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Category Locks Edit */}
                          <div>
                            <p className="text-xs font-medium flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              Category Locks
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1 mb-2">
                              {editedCategoryLocks.map((category, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs flex items-center gap-1"
                                >
                                  {category}
                                  <X
                                    className="h-3 w-3 cursor-pointer"
                                    onClick={() => removeCategoryLock(index)}
                                  />
                                </Badge>
                              ))}
                              {editedCategoryLocks.length === 0 && (
                                <span className="text-xs text-muted-foreground italic">
                                  No category restrictions
                                </span>
                              )}
                            </div>
                            <div className="flex gap-1">
                              <Input
                                value={newCategoryLock}
                                onChange={(e) =>
                                  setNewCategoryLock(e.target.value)
                                }
                                placeholder="Add category (e.g., Office Supplies)"
                                className="h-7 text-xs"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2"
                                onClick={addCategoryLock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              Keyword Lock
                            </p>
                            <Input
                              value={editedKeywordLock}
                              onChange={(e) =>
                                setEditedKeywordLock(e.target.value)
                              }
                              placeholder="Enter keywords in regex format"
                              className="h-7 text-xs mt-1"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Separate multiple keywords with commas
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-between">
                    <span>Grant Purpose</span>
                    {!isEditingPurpose &&
                    cardDetails.status.toLowerCase() !== "cancelled" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setIsEditingPurpose(true)}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    ) : isEditingPurpose ? (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={cancelEditingPurpose}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={savePurpose}
                        >
                          <Save className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                      </div>
                    ) : null}
                  </h3>

                  {!isEditingPurpose ? (
                    <div className="bg-muted/50 p-3 rounded-md text-sm">
                      {cardDetails.notes || "No purpose specified."}
                    </div>
                  ) : (
                    <div className="bg-muted/30 p-3 rounded-md">
                      <Textarea
                        value={editedPurpose}
                        onChange={(e) => setEditedPurpose(e.target.value)}
                        placeholder="Enter the purpose of this grant"
                        className="min-h-[100px] text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Describe what this grant is intended to fund and any
                        specific requirements.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Automation Details */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Automation Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm capitalize">{log.type || "Email"}</p>
                </div>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm">
                    {format(new Date(log.createdAt), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            {cardDetails.status.toLowerCase() !== "cancelled" && (
              <Button
                variant="destructive"
                onClick={() => setCancelDialogOpen(true)}
              >
                <Ban className="mr-2 h-4 w-4" />
                Cancel Grant
              </Button>
            )}
            <Button asChild>
              <a href={`mailto:${cardDetails.recipientEmail}`}>
                Contact Recipient
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Grant Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this grant?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will immediately cancel the grant and revoke access to
              the funds. The recipient will be notified. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelGrant}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? "Cancelling..." : "Yes, cancel grant"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
