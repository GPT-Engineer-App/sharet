import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Button onClick={() => navigate("/app")}>Go to External Share</Button>
    </div>
  );
};

export default Index;
