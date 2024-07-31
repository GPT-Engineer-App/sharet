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

const TrelloExternalShare = ({ setShareType }) => {
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
              <NewShareForm setShareType={setShareType} />
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
  const [shareType, setShareType] = useState("card");
  const [permission, setPermission] = useState("view");

  const handleCreateShare = () => {
    toast({
      title: "Share link created",
      description: "The share link has been created successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="shareType">Share Type</Label>
          <Select value={shareType} onValueChange={setShareType}>
            <SelectTrigger id="shareType">
              <SelectValue placeholder="Select what to share" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Single Card</SelectItem>
              <SelectItem value="list">List of Cards</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="name">Name*</Label>
          <Input id="name" placeholder={`e.g. ${shareType === 'card' ? 'Marketing campaign idea' : 'Q3 Marketing plans'}`} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
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
        <div>
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <div className="flex items-center space-x-2">
            <Input id="expiryDate" type="date" />
            <Calendar className="h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>
      <div>
        <Label>Permissions</Label>
        <div className="flex space-x-2 mt-2">
          <Button
            variant={permission === "view" ? "default" : "outline"}
            onClick={() => setPermission("view")}
          >
            View
          </Button>
          <Button
            variant={permission === "comment" ? "default" : "outline"}
            onClick={() => setPermission("comment")}
          >
            Comment
          </Button>
          <Button
            variant={permission === "edit" ? "default" : "outline"}
            onClick={() => setPermission("edit")}
          >
            Edit
          </Button>
        </div>
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

const ApplyFilters = ({ shareType }) => {
  return (
    <Tabs defaultValue="share" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="share">Share</TabsTrigger>
        <TabsTrigger value="filters">Filters</TabsTrigger>
      </TabsList>
      <TabsContent value="share">
        {/* Content from NewShareForm will go here */}
      </TabsContent>
      <TabsContent value="filters">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="labels">Labels</Label>
              <Select>
                <SelectTrigger id="labels">
                  <SelectValue placeholder="Select labels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {shareType === 'list' && (
              <div>
                <Label htmlFor="lists">Lists</Label>
                <Select>
                  <SelectTrigger id="lists">
                    <SelectValue placeholder="Select lists" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="doing">Doing</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

const AttachmentsSection = () => {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState([
    { id: 1, name: "example-attachment.pdf", size: "2.5 MB" },
    { id: 2, name: "project-plan.docx", size: "1.8 MB" },
  ]);

  const handleCopyLink = (name) => {
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
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold">Attachments</h3>
      <div className="grid gap-2">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="border rounded p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{attachment.name}</span>
              <span className="text-sm text-gray-500">{attachment.size}</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleCopyLink(attachment.name)}>
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteAttachment(attachment.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Add an attachment
      </Button>
    </div>
  );
};

const Index = () => {
  const [shareType, setShareType] = useState("card");

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>External Share</CardTitle>
            <CardDescription>Securely share specific cards, lists, and attachments with external stakeholders</CardDescription>
          </CardHeader>
          <CardContent>
            <ApplyFilters shareType={shareType} />
          </CardContent>
        </Card>
      </div>
      <div className="container mx-auto max-w-4xl mt-8">
        <AttachmentsSection />
      </div>
    </div>
  );
};

export default Index;
