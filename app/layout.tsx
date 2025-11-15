import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";


export const metadata: Metadata = {
  title: "Contact App",
  description: "A simple contact management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <div className = "min-h-screen bg-gray-50">
          <Navbar />
          <main className = "container mx-auto px-4 py-8 grow">
          {children}
          </main>
          
      {/* Footer */}
      <Footer />
  
        </div>
      </body>
    </html>
  );
}
