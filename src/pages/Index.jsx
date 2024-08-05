import { useState, useEffect, useMemo } from 'react';
import { workspaces } from '../mockData';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Share, Plus, Copy, Eye, EyeOff, Trash2, CreditCard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCredits } from '../hooks/useCredits';
import { PaymentDialog } from '../components/PaymentDialog';

const Index = () => {
  const { credits, freeSharesLeft, updateCredits } = useCredits();
  const [shareType, setShareType] = useState("card");
  const [cardCount, setCardCount] = useState(1);

  const cost = useMemo(() => {
    if (freeSharesLeft > 0) return 0;
    return shareType === "card" ? 1 : Math.max(1, cardCount - 1);
  }, [shareType, cardCount, freeSharesLeft]);

  const displayCredits = credits - cost;

  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>External Share</CardTitle>
            <div className="flex justify-between items-center mt-2">
              {displayCredits > 0 ? (
                <span>Credits: {credits.toFixed(2)} (-{cost})</span>
              ) : (
                <PaymentDialog onPaymentSuccess={updateCredits} />
              )}
              <span>Free shares left: {freeSharesLeft}</span>
              {displayCredits > 0 && <PaymentDialog onPaymentSuccess={updateCredits} />}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="newShare">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="newShare">New Share</TabsTrigger>
                <TabsTrigger value="previousLinks">Previous Links</TabsTrigger>
              </TabsList>
              <TabsContent value="newShare">
                <NewShareForm
                  shareType={shareType}
                  setShareType={setShareType}
                  cardCount={cardCount}
                  setCardCount={setCardCount}
                />
              </TabsContent>
              <TabsContent value="previousLinks">
                <PreviousLinks />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const NewShareForm = ({ shareType, setShareType }) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const { credits, freeSharesLeft, updateCredits } = useCredits();

  const calculateCost = () => {
    if (freeSharesLeft > 0) return 0;
    return shareType === "card" ? 1 : Math.max(1, cardCount - 1);
  };

  const [selectedList, setSelectedList] = useState(null);
  const [generatedUrls, setGeneratedUrls] = useState(null);

  const handleCreateShare = () => {
    const cost = calculateCost();
    if (cost > credits) {
      toast({
        title: "Insufficient credits",
        description: "Please purchase more credits to create this share.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically call an API to create the share
    // For now, we'll simulate generating URLs
    if (shareType === "card") {
      const cardUrl = `https://example.com/share/card/${Date.now()}`;
      setGeneratedUrls({ cardUrl });
    } else if (shareType === "list" && selectedList) {
      const listUrl = `https://example.com/share/list/${selectedList.id}`;
      const cardUrls = selectedList.cards.map(card => ({
        name: card.name,
        url: `https://example.com/share/card/${card.id}`
      }));
      setGeneratedUrls({ listUrl, cardUrls });
    }

    // Update credits
    if (freeSharesLeft > 0) {
      updateCredits(credits, freeSharesLeft - 1);
    } else {
      updateCredits(credits - cost, freeSharesLeft);
    }

    toast({
      title: "Share link(s) created",
      description: "The share link(s) have been created successfully.",
    });
  };

  const handleListSelect = (listId) => {
    const selected = workspaces
      .flatMap(w => w.boards)
      .flatMap(b => b.lists)
      .find(l => l.id === listId);
    setSelectedList(selected);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-1/4">
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
        <div className="w-3/4">
          <Label htmlFor="name">Name*</Label>
          <Input id="name" placeholder={`e.g. ${shareType === 'card' ? 'Marketing campaign idea' : 'Q3 Marketing plans'}`} />
        </div>
      </div>
      {shareType === "list" && (
        <div className="mt-4">
          <Label htmlFor="listSelect">Select List</Label>
          <Select onValueChange={(value) => console.log("Selected list:", value)}>
            <SelectTrigger id="listSelect">
              <SelectValue placeholder="Select a list" />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((workspace) => (
                <SelectGroup key={workspace.id}>
                  <SelectLabel>{workspace.name}</SelectLabel>
                  {workspace.boards.map((board) => (
                    <SelectGroup key={board.id}>
                      <SelectLabel className="pl-4">{board.name}</SelectLabel>
                      {board.lists.map((list) => (
                        <SelectItem key={list.id} value={list.id} className="pl-8">
                          {list.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex space-x-4">
        <div className="w-1/2">
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
        <div className="w-1/2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input id="expiryDate" type="date" />
        </div>
      </div>
      <Button className="w-full" onClick={handleCreateShare}>
        <Share className="mr-2 h-4 w-4" /> Create Share Link
      </Button>
      {generatedUrls && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Generated Share Links:</h3>
          {generatedUrls.cardUrl && (
            <div className="flex items-center justify-between">
              <span className="truncate">{generatedUrls.cardUrl}</span>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedUrls.cardUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
          {generatedUrls.listUrl && (
            <div className="flex items-center justify-between">
              <span className="truncate">List URL: {generatedUrls.listUrl}</span>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(generatedUrls.listUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
          {generatedUrls.cardUrls && generatedUrls.cardUrls.map((card, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="truncate">{card.name}: {card.url}</span>
              <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(card.url)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PreviousLinks = () => {
  const { toast } = useToast();
  const [links, setLinks] = useState([]);

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
