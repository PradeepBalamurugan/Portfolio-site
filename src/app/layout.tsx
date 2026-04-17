import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pradeepbalamurugan.com"),
  title: "Pradeep Balamurugan — Full Stack Developer",
  description:
    "Full Stack Developer specializing in Node.js, Next.js, React, and Java. Building scalable middleware, e-commerce platforms, and enterprise solutions.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "Node.js",
    "Java",
    "TypeScript",
    "Portfolio",
    "Pradeep Balamurugan",
  ],
  authors: [{ name: "Pradeep Balamurugan" }],
  alternates: {
    canonical: "https://pradeepbalamurugan.com",
  },
  openGraph: {
    title: "Pradeep Balamurugan — Full Stack Developer",
    description:
      "Engineering scalable systems that bridge the gap between business logic and beautiful user experiences.",
    type: "website",
    locale: "en_US",
    url: "https://pradeepbalamurugan.com",
    siteName: "Pradeep Balamurugan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pradeep Balamurugan — Full Stack Developer",
    description:
      "Engineering scalable systems that bridge the gap between business logic and beautiful user experiences.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
