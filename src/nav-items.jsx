import { Share2, Home } from "lucide-react";
import Index from "./pages/Index.jsx";
import Introduction from "./pages/Introduction.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Introduction />,
  },
  {
    title: "Cardshare App",
    to: "/app",
    icon: <Share2 className="h-4 w-4" />,
    page: <Index />,
  },
];
