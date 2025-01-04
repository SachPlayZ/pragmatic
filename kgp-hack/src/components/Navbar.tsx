import React, { useState } from "react";
import { Search } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="bg-gray-900 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <img src="/lotus.svg" alt="Logo" className="h-10" />

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href=""
              className="text-white hover:text-transparent bg-clip-text hover:bg-gradient-to-r from-[#ff8000] to-[#ff3300] transition-all duration-300 gradient-text"
            >
              Browse Hotels
            </a>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-transparent gradient-focus-ring caret-orange-600"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600"
              size={18}
            />
          </div>
        </div>

        {/* Connect Wallet Button */}
        <ConnectButton chainStatus={"none"} />
      </div>
    </nav>
  );
};

export default Navbar;
