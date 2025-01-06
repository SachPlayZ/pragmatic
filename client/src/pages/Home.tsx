"use client";

import { Link } from "react-router-dom";
import { CuboidIcon as Cube } from "lucide-react";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A1A1F] relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#D0FD3E]/20 rounded-full blur-3xl" />
      </div>

      <header className="fixed top-0 w-full z-50">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 h-20"
        >
          <div className="w-full h-full backdrop-blur-md bg-[#0A1A1F]/60 rounded-2xl mt-4 px-6 flex items-center justify-between border border-white/10">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <Cube className="h-8 w-8 text-[#D0FD3E]" />
              </motion.div>
              <span className="text-white font-bold text-xl">TOKENX</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              {["Home", "Properties", "How it Works", "About Us"].map(
                (item) => (
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
                )
              )}
            </nav>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {/* <Link
                to="#"
                className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F] px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-[#D0FD3E]/20 transition-all"
              >
                Connect Wallet
              </Link> */}
              <ConnectButton accountStatus="avatar" chainStatus="icon" />
            </motion.div>
          </div>
        </motion.div>
      </header>

      <main className="pt-10">
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="space-y-8 backdrop-blur-sm bg-white/5 p-8 rounded-2xl border border-white/10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Invest in Premium
                  </span>{" "}
                  <span className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">
                    Real Estate
                  </span>{" "}
                  <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    with Digital Tokens
                  </span>
                </h1>
                <p className="text-white/80 text-lg md:text-xl max-w-2xl">
                  Access fractional ownership of high-value properties through
                  blockchain technology. Start investing with minimal capital
                  and earn passive income from rental yields.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="#"
                      className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F] px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#D0FD3E]/20 transition-all text-center block"
                    >
                      Explore Properties
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="#"
                      className="bg-gradient-to-r from-[#D0FD3E]/10 to-[#9EF01A]/10 border border-[#D0FD3E] text-[#D0FD3E] px-8 py-3 rounded-lg font-medium hover:bg-[#D0FD3E]/20 transition-all text-center block"
                    >
                      Learn More
                    </Link>
                  </motion.div>
                </div>
              </div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center space-x-4"
              >
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="w-10 h-10 rounded-full border-2 border-[#0A1A1F] bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] flex items-center justify-center text-[#0A1A1F] font-medium"
                    >
                      {String.fromCharCode(65 + i)}
                    </motion.div>
                  ))}
                </div>
                <p className="text-white/80">
                  <span className="text-[#D0FD3E] font-medium">1000+</span>{" "}
                  investors already onboard
                </p>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/arch.jpg"
                  width={800}
                  height={600}
                  alt="Luxury property visualization"
                  className="w-full"
                />
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">Premium Villa</h3>
                      <p className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent font-bold">
                        100 TOKENS AVAILABLE
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">Starting from</p>
                      <p className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent font-bold">
                        $500/token
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 -right-20 w-40 h-40 bg-[#D0FD3E]/20 rounded-full blur-3xl" />
              <div className="absolute -z-10 bottom-1/2 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
