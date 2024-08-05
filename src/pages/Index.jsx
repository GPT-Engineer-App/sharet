import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TrelloConnect from '../components/TrelloConnect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Share, Plus, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCredits } from '../hooks/useCredits';
import { PaymentDialog } from '../components/PaymentDialog';

const Index = () => {
  const { credits, freeSharesLeft, updateCredits } = useCredits();
  const [shareType, setShareType] = useState("card");
  const [cardCount, setCardCount] = useState(1);
  const [createdLinks, setCreatedLinks] = useState(0);
  const [trelloData, setTrelloData] = useState(null);

  const cost = useMemo(() => {
    if (freeSharesLeft > 0) return 0;
    return shareType === "card" ? 1 : Math.max(1, cardCount - 1);
  }, [shareType, cardCount, freeSharesLeft]);

  const displayCredits = credits - createdLinks;

  const handleCreateLink = () => {
    if (freeSharesLeft > 0) {
      updateCredits(credits, freeSharesLeft - 1);
    } else {
      setCreatedLinks(prevLinks => prevLinks + cost);
    }
  };

  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>External Share</CardTitle>
            <div className="flex justify-between items-center mt-2">
              {!trelloData && <TrelloConnect onConnect={setTrelloData} />}
              {displayCredits > 0 ? (
                <span>Credits: {displayCredits.toFixed(2)} (-{createdLinks})</span>
              ) : (
                <PaymentDialog onPaymentSuccess={(newCredits) => {
                  updateCredits(newCredits, freeSharesLeft);
                  setCreatedLinks(0);
                }} />
              )}
              <span>Free shares left: {freeSharesLeft}</span>
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
                  credits={displayCredits}
                  freeSharesLeft={freeSharesLeft}
                  updateCredits={updateCredits}
                  onCreateLink={handleCreateLink}
                  trelloData={trelloData}
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

const NewShareForm = ({ shareType, setShareType, cardCount, setCardCount, credits, freeSharesLeft, updateCredits, onCreateLink, trelloData }) => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedList, setSelectedList] = useState(null);
  const [generatedUrls, setGeneratedUrls] = useState(null);
  const [isSelectFromList, setIsSelectFromList] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardUrl, setCardUrl] = useState('');

  const calculateCost = () => {
    if (freeSharesLeft > 0) return 0;
    return shareType === "card" ? 1 : Math.max(1, cardCount - 1);
  };

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

    // Simulate generating URLs
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
    onCreateLink();

    toast({
      title: "Share link(s) created",
      description: "The share link(s) have been created successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="shareType">Share Type</Label>
            <Select value={shareType} onValueChange={setShareType}>
              <SelectTrigger id="shareType" className="h-10">
                <SelectValue placeholder="Select what to share" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Single Card</SelectItem>
                <SelectItem value="list">List of Cards</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="name">Name*</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="nameToggle" className="text-sm">Select from list</Label>
                <Switch id="nameToggle" onCheckedChange={setIsSelectFromList} />
              </div>
            </div>
            {isSelectFromList ? (
              <Select onValueChange={(cardId) => setSelectedCard(trelloData ? trelloData.boards.flatMap(b => b.lists).flatMap(l => l.cards).find(c => c.id === cardId) : null)}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a card" />
                </SelectTrigger>
                <SelectContent>
                  {trelloData ? (
                    trelloData.boards.map((board) => (
                      <SelectGroup key={board.id}>
                        <SelectLabel>{board.name}</SelectLabel>
                        {board.lists.map((list) => (
                          <SelectGroup key={list.id}>
                            <SelectLabel className="pl-4">{list.name}</SelectLabel>
                            {list.cards.map((card) => (
                              <SelectItem key={card.id} value={card.id} className="pl-8">
                                {card.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectGroup>
                    ))
                  ) : (
                    <SelectItem value="connect">Connect to Trello to see cards</SelectItem>
                  )}
                </SelectContent>
              </Select>
            ) : (
              <Input 
                id="name" 
                placeholder="Enter card URL" 
                value={cardUrl}
                onChange={(e) => setCardUrl(e.target.value)}
                className="h-10"
              />
            )}
          </div>
        </div>
      </div>
      {shareType === "list" && (
        <div className="mt-4">
          <Label htmlFor="listSelect">Select List</Label>
          <Select onValueChange={(listId) => setSelectedList(trelloData ? trelloData.boards.flatMap(b => b.lists).find(l => l.id === listId) : null)}>
            <SelectTrigger id="listSelect" className="h-10">
              <SelectValue placeholder="Select a list" />
            </SelectTrigger>
            <SelectContent>
              {trelloData ? (
                trelloData.boards.map((board) => (
                  <SelectGroup key={board.id}>
                    <SelectLabel>{board.name}</SelectLabel>
                    {board.lists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        {list.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))
              ) : (
                <SelectItem value="connect">Connect to Trello to see lists</SelectItem>
              )}
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
              className="h-10"
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
          <Input id="expiryDate" type="date" className="h-10" />
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
