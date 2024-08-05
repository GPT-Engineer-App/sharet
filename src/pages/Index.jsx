import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Share, Plus, Link, Calendar, Copy, Eye, EyeOff, Trash2, BarChart3, Users, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Index = () => {
  const [shareType, setShareType] = useState("card");

  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Business Overview</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Customers" value="22,343" icon={<Users className="h-6 w-6" />} change={3.5} />
          <StatCard title="Total Revenue" value="$32,234" icon={<DollarSign className="h-6 w-6" />} change={-2.4} />
          <StatCard title="Active Users" value="12,537" icon={<BarChart3 className="h-6 w-6" />} change={1.8} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>External Share</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="newShare">
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
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, change }) => (
  <Card>
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
        <p className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </p>
      </div>
      <div className="p-4 bg-primary/10 rounded-full">
        {icon}
      </div>
    </CardContent>
  </Card>
);

const SalesChart = () => {
  const data = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="sales" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const NewShareForm = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [shareType, setShareType] = useState("card");

  const handleCreateShare = () => {
    toast({
      title: "Share link created",
      description: "The share link has been created successfully.",
    });
  };

  return (
    <div className="space-y-4">
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
          <Calendar className="h-4 w-4 text-muted-foreground" />
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
          <div key={link.id} className="flex justify-between items-center p-2 bg-secondary rounded-md">
            <div>
              <h3 className="font-semibold">{link.name}</h3>
              <p className="text-sm text-muted-foreground">Expires: {link.expiry}</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleCopyLink(link.url)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
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
                    <Button variant="destructive" onClick={() => handleDeleteLink(link.id)}>Yes, delete it</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">You have no previous share links.</p>
      )}
      <Button variant="outline" className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Create New Share Link
      </Button>
    </div>
  );
};

export default Index;
