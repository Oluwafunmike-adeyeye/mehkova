import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { AuthProvider } from '@/context/auth-context'
import { Toaster } from "@/components/ui/sonner";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ['300', '400', '500', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: {
    default: "Mehkova - Fashion & Jewelry",
    template: "%s | Mehkova"
  },
  description: "Discover the latest fashion trends and exquisite jewelry collections in Nigeria",
  metadataBase: new URL('https://mehkova.netlify.app'),
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    siteName: 'Mehkova',
    images: '/og-image.jpg'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${sora.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <Toaster position="bottom-right" />
            </div>
          </AuthProvider>   
        </ThemeProvider>
      </body>
    </html>
  );
}