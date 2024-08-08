import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Welcome to Cardshare</h1>
          <p className="text-xl text-blue-300">Securely share your Trello cards with external collaborators</p>
        </header>

        <section className="bg-[#161b22] rounded-lg p-6 space-y-4">
          <h2 className="text-3xl font-semibold">What is Cardshare?</h2>
          <p className="text-lg">
            Cardshare is a powerful tool that allows you to share individual Trello cards or entire lists with people outside your
            organization, without giving them access to your full Trello board. It's perfect for collaborating with clients, contractors,
            or temporary team members.
          </p>
        </section>

        <section className="bg-[#161b22] rounded-lg p-6 space-y-4">
          <h2 className="text-3xl font-semibold">Key Benefits</h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Securely share specific cards or lists without exposing your entire Trello board</li>
            <li>Set expiration dates for shared links to maintain control over access</li>
            <li>Password-protect shared links for an extra layer of security</li>
            <li>Generate QR codes for easy sharing in physical documents or presentations</li>
            <li>Track and manage all your shared links in one place</li>
          </ul>
        </section>

        <section className="bg-[#161b22] rounded-lg p-6 space-y-4">
          <h2 className="text-3xl font-semibold">How to Use Cardshare</h2>
          <ol className="list-decimal list-inside space-y-2 text-lg">
            <li>Connect your Trello account to Cardshare</li>
            <li>Select the card or list you want to share</li>
            <li>Choose your sharing options (expiration date, password protection)</li>
            <li>Generate a secure sharing link or QR code</li>
            <li>Send the link to your external collaborator</li>
          </ol>
        </section>

        <section className="bg-[#161b22] rounded-lg p-6 space-y-4">
          <h2 className="text-3xl font-semibold">Try Cardshare for Free</h2>
          <p className="text-lg text-blue-300">Get started with 3 free shares to test our tool</p>
          <p className="text-lg">
            We're confident you'll love the simplicity and security of Cardshare. That's why we're offering you 3 free shares to try
            out our tool. No credit card required!
          </p>
          <Button 
            onClick={() => navigate("/app")} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Start Sharing Now
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Index;
