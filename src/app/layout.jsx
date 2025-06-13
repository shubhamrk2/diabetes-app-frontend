import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import ClientWrapper from "@/components/ClientWrapper"; // New wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Diabetes Health Hub",
  description: "A comprehensive platform for managing diabetes with food, equipment, and resources.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
        
        <ClientWrapper>
          <Navbar />
          {children}
          <Footer />
          <Toaster position="top-right" />
        </ClientWrapper>
      </body>
    </html>
  );
}
