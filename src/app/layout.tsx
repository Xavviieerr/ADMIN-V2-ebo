import FloatingKeyboardWidget from "@/components/FloatingKeyboardWidget";
import AppShellSplash from "@/components/app-shell-splash";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { DM_Sans, Plus_Jakarta_Sans } from "next/font/google";
import KeyboardProvider from "@/features/shared/components/keyboard-context";

const _dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

const plusSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.jpg" sizes="any" />
        <meta
          name="google-site-verification"
          content="S7RypLHIVXHTolGJPfgGUHyC5JH8_Ml1O-L-ffE-mnQ"
        />
      </head>
      <body className={`${plusSans.variable} bg-base-bg font-dm-sans`} suppressHydrationWarning>
        <KeyboardProvider>
          <Providers>
            <AppShellSplash>{children}</AppShellSplash>
            <FloatingKeyboardWidget />
          </Providers>
        </KeyboardProvider>
      </body>
    </html>
  );
}
