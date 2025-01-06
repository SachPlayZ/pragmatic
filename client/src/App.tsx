import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Anon from "./pages/Anon";

const App = () => {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anon" element={<Anon />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
