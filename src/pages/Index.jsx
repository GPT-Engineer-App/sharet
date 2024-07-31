import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Share, Plus, Link, Calendar, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const TrelloExternalShare = () => {
  const [activeTab, setActiveTab] = useState('newShare');

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>External Share</CardTitle>
          <CardDescription>Securely share specific cards, lists, and attachments with external stakeholders</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="newShare">New Share</TabsTrigger>
              <TabsTrigger value="previousLinks">Previous Links</TabsTrigger>
            </TabsList>
            <TabsContent value="newShare">
              <NewShareForm />
            </TabsContent>
            <TabsContent value="previousLinks">
              <PreviousLinks />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const NewShareForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateShare = () => {
    // Simulating share creation
    toast({
      title: "Share link created",
      description: "The share link has been created successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name*</Label>
        <Input id="name" placeholder="e.g. Marketing team Q3 plans" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="secret">Secret</Label>
        <div className="flex items-center space-x-2">
          <Input 
            id="secret" 
            type={showPassword ? "text" : "password"} 
            placeholder="Optional password" 
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <div className="flex items-center space-x-2">
          <Input id="expiryDate" type="date" />
          <Calendar className="h-4 w-4 text-gray-500" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="permissions">Permissions</Label>
        <Select>
          <SelectTrigger id="permissions">
            <SelectValue placeholder="Select permissions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="view">View only</SelectItem>
            <SelectItem value="comment">Comment</SelectItem>
            <SelectItem value="edit">Edit</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">I agree to the terms and conditions</Label>
      </div>
      <Button className="w-full" onClick={handleCreateShare}>
        <Share className="mr-2 h-4 w-4" /> Create Share Link
      </Button>
    </div>
  );
};

const PreviousLinks = () => {
  const { toast } = useToast();
  const [links, setLinks] = useState([
    { id: 1, name: "Q3 Marketing Plans", expiry: "2023-09-30", url: "https://trello.com/share/abc123" },
    { id: 2, name: "Product Roadmap", expiry: "2023-12-31", url: "https://trello.com/share/def456" },
  ]);

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "The share link has been copied to your clipboard.",
    });
  };

  const handleDeleteLink = (id) => {
    setLinks(links.filter(link => link.id !== id));
    toast({
      title: "Link deleted",
      description: "The share link has been deleted.",
    });
  };

  return (
    <div className="space-y-4">
      {links.length > 0 ? (
        links.map((link) => (
          <Card key={link.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{link.name}</h3>
                  <p className="text-sm text-gray-500">Expires: {link.expiry}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleCopyLink(link.url)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to delete this share link?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. The link will no longer be accessible.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => handleDeleteLink(link.id)}>Yes, delete it</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>You have no previous share links.</p>
      )}
      <Button variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Create New Share Link
      </Button>
    </div>
  );
};

const ApplyFilters = () => {
  const [filtersEnabled, setFiltersEnabled] = useState(false);

  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Applying filters</h3>
        <div className="flex items-center space-x-2">
          <Switch 
            id="filter-toggle" 
            checked={filtersEnabled}
            onCheckedChange={setFiltersEnabled}
          />
          <Label htmlFor="filter-toggle">Filters</Label>
        </div>
      </div>
      {filtersEnabled && (
        <>
          <div className="space-y-2">
            <Label htmlFor="labels">Labels</Label>
            <Select>
              <SelectTrigger id="labels">
                <SelectValue placeholder="Select one or more labels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="important">Important</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lists">Lists</Label>
            <Select>
              <SelectTrigger id="lists">
                <SelectValue placeholder="Select one or more lists" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="doing">Doing</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
};

const AttachmentsSection = () => {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState([
    { id: 1, name: "example-attachment.pdf", size: "2.5 MB" },
    { id: 2, name: "project-plan.docx", size: "1.8 MB" },
  ]);

  const handleCopyLink = (name) => {
    // Simulating link copy
    navigator.clipboard.writeText(`https://trello.com/attachment/${name}`);
    toast({
      title: "Link copied",
      description: "The attachment link has been copied to your clipboard.",
    });
  };

  const handleDeleteAttachment = (id) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
    toast({
      title: "Attachment deleted",
      description: "The attachment has been removed from the share.",
    });
  };

  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold">Attachments</h3>
      {attachments.map((attachment) => (
        <div key={attachment.id} className="border rounded p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{attachment.name}</span>
              <span className="text-sm text-gray-500 ml-2">{attachment.size}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleCopyLink(attachment.name)}>
                <Link className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteAttachment(attachment.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add an attachment
      </Button>
    </div>
  );
};

const Index = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <TrelloExternalShare />
      <div className="container mx-auto max-w-4xl mt-8">
        <ApplyFilters />
        <AttachmentsSection />
      </div>
    </div>
  );
};

export default Index;
