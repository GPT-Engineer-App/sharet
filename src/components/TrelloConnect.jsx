import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TrelloClient } from '@trello/api-client';

const TrelloConnect = ({ onConnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const trello = new TrelloClient({
        key: 'YOUR_TRELLO_API_KEY',
        token: 'USER_TOKEN', // You'll need to implement OAuth to get this token
      });

      const member = await trello.member.get('me');
      const boards = await trello.member.getBoards('me');

      // Process the boards to include lists and cards
      const fullBoards = await Promise.all(boards.map(async (board) => {
        const lists = await trello.board.getLists(board.id);
        const fullLists = await Promise.all(lists.map(async (list) => {
          const cards = await trello.list.getCards(list.id);
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
