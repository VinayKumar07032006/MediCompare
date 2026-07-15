import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MediCompare | Compare Diagnostic Services & Hospital Slots Near You",
  description: "Compare hospital diagnostic services (MRI, CT Scan, X-Ray, Blood Tests) in India based on Price, Distance, Ratings, and Booking Slot availability. Book instantly with AI-powered recommendations.",
  keywords: ["MediCompare", "hospital comparison", "MRI scan price", "CT scan cost India", "blood test near me", "diagnostic checkup pricing", "book diagnostic tests online"],
  authors: [{ name: "MediCompare Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col bg-slate-50 text-slate-900 scroll-smooth">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
