import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Anon from "./pages/Anon";
import BuyOrRent from "./pages/BuyOrRent";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anon" element={<Anon />} />
        <Route path="/properties" element={<BuyOrRent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
