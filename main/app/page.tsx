"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Loader2, CheckCircle, DollarSign, Building } from "lucide-react";
import Navbar from "@/components/MajorUI/Navbar";

interface Property {
  id: number;
  owner: string;
  imageUrl: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  sqft: number;
}

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  async function getProperties() {
    const res = await fetch(`${process.env.VITE_PUBLIC_BACKEND_URL}/property`);
    const data = await res.json();
    return data as Property[];
  }

  useEffect(() => {
    getProperties()
      .then((data) => {
        setProperties(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching properties:", error);
        setIsLoading(false);
      });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (_current: number, next: number) => setCurrentSlide(next),
  };

  return (
    <div className="min-h-screen bg-[#0A1A1F] relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#D0FD3E]/20 rounded-full blur-3xl" />
      </div>
      <Navbar />

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
                      href="#"
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
                      href="#"
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
                {isLoading ? (
                  <div className="w-full h-[400px] flex items-center justify-center bg-white/5">
                    <Loader2 className="w-8 h-8 text-[#D0FD3E] animate-spin" />
                  </div>
                ) : (
                  <Slider {...sliderSettings}>
                    {properties.map((property) => (
                      <div key={property.id}>
                        <img
                          src={property.imageUrl || "/placeholder.svg"}
                          width={800}
                          height={600}
                          alt={property.name}
                          className="w-full h-[400px] object-cover"
                        />
                      </div>
                    ))}
                  </Slider>
                )}
                {!isLoading && properties[currentSlide] && (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-white font-medium">
                          {properties[currentSlide].name}
                        </h3>
                        <p className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent font-bold">
                          {properties[currentSlide].bedrooms} BHK
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">Price</p>
                        <p className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent font-bold">
                          {Number(properties[currentSlide].price) / 10 ** 18}
                          $AVAX
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 -right-20 w-40 h-40 bg-[#D0FD3E]/20 rounded-full blur-3xl" />
              <div className="absolute -z-10 bottom-1/2 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">
              TokenEstate
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle className="w-8 h-8 text-[#D0FD3E]" />,
                title: "Fractional Ownership",
                description:
                  "Own a piece of premium real estate with minimal investment.",
              },
              {
                icon: <DollarSign className="w-8 h-8 text-[#D0FD3E]" />,
                title: "Passive Income",
                description:
                  "Earn regular rental income from your property investments.",
              },
              {
                icon: <Building className="w-8 h-8 text-[#D0FD3E]" />,
                title: "Diverse Portfolio",
                description:
                  "Invest in multiple properties to spread your risk.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            How It{" "}
            <span className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Sign Up",
              "Choose Properties",
              "Purchase Tokens",
              "Earn Passive Income",
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] flex items-center justify-center text-[#0A1A1F] text-2xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step}
                </h3>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            What Our{" "}
            <span className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] bg-clip-text text-transparent">
              Investors Say
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "John Doe",
                role: "Real Estate Investor",
                quote:
                  "TokenEstate has revolutionized the way I invest in real estate. It's so easy and accessible!",
              },
              {
                name: "Jane Smith",
                role: "First-time Investor",
                quote:
                  "I never thought I could own a piece of premium property. Thanks to TokenEstate, now I can!",
              },
              {
                name: "Mike Johnson",
                role: "Experienced Trader",
                quote:
                  "The transparency and ease of use of TokenEstate's platform is unmatched in the industry.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                className="backdrop-blur-sm bg-white/5 p-6 rounded-xl border border-white/10"
              >
                <p className="text-white/80 mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] flex items-center justify-center text-[#0A1A1F] text-xl font-bold mr-4">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="text-white/60">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="backdrop-blur-sm bg-white/5 p-8 md:p-12 rounded-2xl border border-white/10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Real Estate Investment Journey?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join TokenEstate today and unlock the potential of fractional real
              estate ownership. Start building your diverse property portfolio
              with just a few clicks.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                href="#"
                className="bg-gradient-to-r from-[#D0FD3E] to-[#9EF01A] text-[#0A1A1F] px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#D0FD3E]/20 transition-all"
              >
                Get Started Now
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A1A1F] border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">TokenEstate</h3>
              <p className="text-white/60">
                Revolutionizing real estate investment through blockchain
                technology.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-white/60 hover:text-[#D0FD3E]">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/60 hover:text-[#D0FD3E]">
                    Properties
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/60 hover:text-[#D0FD3E]">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-white/60 hover:text-[#D0FD3E]">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <p className="text-white/60">Email: info@tokenestate.com</p>
              <p className="text-white/60">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/60">
            <p>&copy; 2025 TokenEstate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
