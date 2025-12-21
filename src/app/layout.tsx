import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FloatingContact from "../components/FloatingContact";
import PerformanceMonitor from "../components/PerformanceMonitor";
// import MessageButton from "../components/MessageButton"; // Commented out - will add later
import { AuthProvider } from "../contexts/AuthContext";
import { QueryProvider } from "../providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KinderBridge - Find Your Perfect Childcare Match",
  description:
    "Connect with verified KinderBridge locations across the GTA. AI-powered matching, real-time availability, and personalized recommendations for your child's early education journey.",
  keywords:
    "KinderBridge, childcare, GTA, Toronto, Whitby, Oshawa, Ajax, Mississauga, Brampton, Oakville, early education, preschool",
  authors: [{ name: "KinderBridge Team" }],
  openGraph: {
    title: "KinderBridge - Find Your Perfect Childcare Match",
    description:
      "Connect with verified KinderBridge locations across the GTA. AI-powered matching, real-time availability, and personalized recommendations.",
    type: "website",
    locale: "en_CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            {children}
            <FloatingContact />
            <PerformanceMonitor />
            {/* <MessageButton /> */} {/* Commented out - will add later */}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
