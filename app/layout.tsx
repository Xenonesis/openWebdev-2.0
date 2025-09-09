import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import { FontLoader } from "@/app/components/fonts";

// Dynamic font loading for better reliability in different environments
const fontClassName = process.env.NODE_ENV === 'production' ? 'font-sans' : 'font-sans';

export const metadata: Metadata = {
  title: "openWebDev",
  description: "Re-imagine any website in seconds with AI-powered website builder.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={fontClassName}>
        <FontLoader />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
