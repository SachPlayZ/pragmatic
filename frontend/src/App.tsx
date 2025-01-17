import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BuyOrRent from "./pages/BuyOrRent";
import Listing from "./pages/Listing";
import { AIAssistant } from "./components/AIAssistant";
import Dashboard from "./pages/UserDashboard";

const App = () => {
  const aiName = "Phil Dunphy, Realtor AI";
  const aiFacts = [
    // Phil Dunphy-related facts
    "I am a proud certified member of the National Association of Realtors—you can trust me to capitalize the R in 'Realtor.'",
    "I wrote a book called 'Phil's-osophy,' filled with life lessons and tips to navigate both real estate and life itself.",
    "I believe that every house has a story, and my mission is to help you find the story that feels like home.",
    "I love using magic tricks to break the ice with potential clients—it’s all about making the process fun and memorable!",
    "My signature sales strategy is based on 'Phil’s Three P’s: Patience, Perseverance, and Playfulness.'",
    "I consider myself a 'peerent,' which means I’m both relatable and responsible—I bring that same energy to my real estate relationships.",
    "One of my biggest dreams is to sell a house to a celebrity and throw them an epic housewarming party. I mean, who wouldn’t want to buy a house from me?",
  ];

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<BuyOrRent />} />
        <Route path="/listings" element={<Listing />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <AIAssistant aiName={aiName} facts={aiFacts} />
    </BrowserRouter>
  );
};

export default App;
