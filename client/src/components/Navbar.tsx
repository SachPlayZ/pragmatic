"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CuboidIcon as Cube } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  return (
    <header className="fixed top-0 w-full z-50">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 h-20"
      >
        <div className="w-full h-full backdrop-blur-md bg-[#0A1A1F]/60 rounded-2xl mt-4 px-6 grid grid-cols-3 items-center border border-white/10">
          {/* Logo - Left Column */}
          <div className="justify-self-start">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Cube className="h-8 w-8 text-[#D0FD3E]" />
              </motion.div>
              <span className="text-white font-bold text-xl">TOKENX</span>
            </Link>
          </div>

          {/* Navigation Links - Center Column */}
          <nav className="hidden md:flex items-center justify-center space-x-8">
            {["Home", "Properties", "How it Works", "About Us"].map((item) => (
              <motion.div
                key={item}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="#"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Connect Wallet Button - Right Column */}
          <div className="justify-self-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ConnectButton accountStatus="avatar" chainStatus="icon" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;
