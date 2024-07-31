import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Share, Plus, Link, Calendar } from "lucide-react";

const TrelloExternalShare = () => {
  const [activeTab, setActiveTab] = useState('newShare');

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
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
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name*</Label>
        <Input id="name" placeholder="e.g. Marketing team Q3 plans" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="secret">Secret</Label>
        <Input id="secret" type="password" placeholder="Optional password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date</Label>
        <div className="flex items-center space-x-2">
          <Input id="expiryDate" type="date" />
          <Calendar className="h-4 w-4 text-gray-500" />
        </div>
      </div>
      <Button className="w-full">
        <Share className="mr-2 h-4 w-4" /> Create Share Link
      </Button>
    </div>
  );
};

const PreviousLinks = () => {
  return (
    <div className="space-y-4">
      <p>Your previous share links will appear here.</p>
      <Button variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Create New Share Link
      </Button>
    </div>
  );
};

const ApplyFilters = () => {
  return (
    <div className="space-y-4 mt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Applying filters</h3>
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Filters</Label>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="labels">Labels</Label>
        <Input id="labels" placeholder="Select one or more labels" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lists">Lists</Label>
        <Input id="lists" placeholder="Select one or more lists" />
      </div>
    </div>
  );
};

const AttachmentsSection = () => {
  return (
    <div className="space-y-4 mt-8">
      <h3 className="text-lg font-semibold">Attachments</h3>
      <div className="border rounded p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span>example-attachment.pdf</span>
          <Button variant="ghost" size="sm">
            <Link className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
        </div>
      </div>
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
      <div className="container mx-auto max-w-3xl mt-8">
        <ApplyFilters />
        <AttachmentsSection />
      </div>
    </div>
  );
};

export default Index;
