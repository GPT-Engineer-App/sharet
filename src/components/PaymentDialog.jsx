import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";

export const PaymentDialog = ({ onPaymentSuccess }) => {
  const [bundle, setBundle] = useState('10');

  const handlePayment = () => {
    // Here you would integrate with a payment processor
    // For now, we'll just simulate a successful payment
    const creditsToAdd = parseInt(bundle);
    onPaymentSuccess((prevCredits) => prevCredits + creditsToAdd);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CreditCard className="mr-2 h-4 w-4" /> Buy Credits
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Credits</DialogTitle>
          <DialogDescription>
            Select a credit bundle to purchase.
          </DialogDescription>
        </DialogHeader>
        <Select value={bundle} onValueChange={setBundle}>
          <SelectTrigger>
            <SelectValue placeholder="Select a bundle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 credits - €0.50</SelectItem>
            <SelectItem value="50">50 credits - €2.50</SelectItem>
            <SelectItem value="100">100 credits - €5.00</SelectItem>
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button onClick={handlePayment}>Purchase</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
