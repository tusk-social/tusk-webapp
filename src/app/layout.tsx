import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { PostModalProvider } from "@/context/PostModalContext";
import { MemeModalProvider } from "@/context/MemeModalContext";
import Providers from "@/components/providers/Providers";
import { UserProvider } from "@/contexts/UserContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tusk",
  description: "A modern Twitter alternative",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <UserProvider>
          <Providers>
            <PostModalProvider>
              <MemeModalProvider>
                {children}
                <Toaster
                  position="bottom-center"
                  toastOptions={{
                    style: {
                      background: "#1f2937",
                      color: "#fff",
                      borderRadius: "9999px",
                    },
                  }}
                />
              </MemeModalProvider>
            </PostModalProvider>
          </Providers>
        </UserProvider>
      </body>
    </html>
  );
}
