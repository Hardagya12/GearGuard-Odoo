
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GearGuard - Maintenance Tracker",
  description: "Odoo-like Maintenance Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-gray-50 text-foreground`}>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300">
             {/* Main content area */}
             {children}
          </div>
        </div>
      </body>
    </html>
  );
}
