import type { Metadata } from "next";
import {  Outfit } from "next/font/google";
import "./globals.css";
import {ToastContainer} from "react-toastify"

import { ThemeProvider } from "next-themes";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  
});
export const metadata: Metadata = {
  title: "Jagoangangkat - Webbing Lifting Solutions",
  description: "Webbing Lifting Solutions ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.className} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        {children}
        </ThemeProvider>

        <ToastContainer position="bottom-right"/>
      </body>
    </html>
  );
}
