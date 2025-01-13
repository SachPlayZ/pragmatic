"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CuboidIcon as Cube, Menu, X } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 h-20"
      >
        <div className="w-full h-full backdrop-blur-md bg-[#0A1A1F]/60 rounded-2xl mt-4 px-6 flex items-center justify-between border border-white/10">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Cube className="h-8 w-8 text-[#D0FD3E]" />
            </motion.div>
            <Link to="/" className="text-white font-bold text-xl">
              TOKENX
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Properties", "Listings", "How it Works", "Dashboard"].map(
              (item) => (
                <motion.div
                  key={item}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </motion.div>
              )
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <motion.div whileTap={{ scale: 0.95 }}>
              {isMobileMenuOpen ? (
                <X
                  className="h-6 w-6 text-white cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              ) : (
                <Menu
                  className="h-6 w-6 text-white cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(true)}
                />
              )}
            </motion.div>
          </div>

          {/* Connect Wallet Button */}
          <div className="hidden md:block">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ConnectButton accountStatus="avatar" chainStatus="icon" />
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#0A1A1F]/90 rounded-xl mt-2 p-4 flex flex-col space-y-4 text-center border border-white/10"
          >
            {["Properties", "Listings", "How it Works", "Dashboard"].map(
              (item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-white/80 hover:text-white transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              )
            )}
            {/* Connect Button for Mobile */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ConnectButton accountStatus="avatar" chainStatus="none" />
            </motion.div>
          </motion.nav>
        )}
      </motion.div>
    </header>
  );
};

export default Navbar;
