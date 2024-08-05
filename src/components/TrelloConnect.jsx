import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const TrelloConnect = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const API_KEY = 'YOUR_TRELLO_API_KEY';
      const TOKEN = 'USER_TOKEN'; // You'll need to implement OAuth to get this token

      const fetchTrelloData = async (url) => {
        const response = await fetch(`https://api.trello.com/1${url}?key=${API_KEY}&token=${TOKEN}`);
        if (!response.ok) throw new Error('Failed to fetch Trello data');
        return response.json();
      };

      const member = await fetchTrelloData('/members/me');
      const boards = await fetchTrelloData('/members/me/boards');

      // Process the boards to include lists and cards
      const fullBoards = await Promise.all(boards.map(async (board) => {
        const lists = await fetchTrelloData(`/boards/${board.id}/lists`);
        const fullLists = await Promise.all(lists.map(async (list) => {
          const cards = await fetchTrelloData(`/lists/${list.id}/cards`);
          return { ...list, cards };
        }));
        return { ...board, lists: fullLists };
      }));

      onConnect({ member, boards: fullBoards });
      toast({
        title: "Connected to Trello",
        description: `Welcome, ${member.fullName}!`,
      });
    } catch (error) {
      console.error('Error connecting to Trello:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Trello. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button onClick={handleConnect} disabled={isConnecting}>
      {isConnecting ? "Connecting..." : "Connect to Trello"}
    </Button>
  );
};

export default TrelloConnect;
