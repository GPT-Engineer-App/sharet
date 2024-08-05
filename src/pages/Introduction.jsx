import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Introduction = () => {
  return (
    <div className="bg-background text-foreground min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Cardshare</h1>
          <p className="text-xl text-muted-foreground">Securely share your Trello cards with external collaborators</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>What is Cardshare?</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Cardshare is a powerful tool that allows you to share individual Trello cards or entire lists with people outside your organization, without giving them access to your full Trello board. It's perfect for collaborating with clients, contractors, or temporary team members.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Securely share specific cards or lists without exposing your entire Trello board</li>
              <li>Set expiration dates for shared links to maintain control over access</li>
              <li>Password-protect shared links for an extra layer of security</li>
              <li>Generate QR codes for easy sharing in physical documents or presentations</li>
              <li>Track and manage all your shared links in one place</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Use Cardshare</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Connect your Trello account to Cardshare</li>
              <li>Select the card or list you want to share</li>
              <li>Choose your sharing options (expiration date, password protection)</li>
              <li>Generate a secure sharing link or QR code</li>
              <li>Send the link to your external collaborator</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Try Cardshare for Free</CardTitle>
            <CardDescription>Get started with 3 free shares to test our tool</CardDescription>
          </CardHeader>
          <CardContent>
            <p>We're confident you'll love the simplicity and security of Cardshare. That's why we're offering you 3 free shares to try out our tool. No credit card required!</p>
          </CardContent>
          <CardFooter>
            <Link to="/app">
              <Button>Start Sharing Now</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Introduction;
