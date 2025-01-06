export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-br from-[#ff8000] to-[#ff3300] text-white">
      <main className="flex-grow flex items-center p-6 md:p-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Invest in Real Estate with Blockchain Technology
            </h1>
            <p className="text-lg mb-8">
              Gain fractional ownership of premium properties through ERC-20
              tokens. Invest, earn returns, and trade real estate assets with
              ease and transparency.
            </p>
            <div className="space-x-4">
              <button className="bg-white text-[#ff3300] px-6 py-2 rounded-full font-semibold hover:bg-opacity-90 transition-colors">
                Explore Properties
              </button>
              <button className="border-2 border-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-[#ff3300] transition-colors">
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="w-64 h-64 mx-auto relative">
              <div className="absolute inset-0 bg-white rounded-lg shadow-lg"></div>
              <div className="absolute inset-4 bg-[#ff8000] rounded-lg shadow-inner animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-16 h-16 bg-white rounded-md shadow-md animate-float"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 md:p-6 text-center">
        <p>&copy; 2025 RealTokens. All rights reserved.</p>
      </footer>
    </div>
  );
}
