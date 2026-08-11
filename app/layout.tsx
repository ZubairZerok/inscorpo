import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Hind_Siliguri } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { UserProvider } from "@/components/providers/user-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const volteBangla = Hind_Siliguri({
  variable: "--font-volte-bangla",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://insyt.co"),
  title: {
    default: "INSYT Corporate — The Career Operating System",
    template: "%s | INSYT Corporate",
  },
  description:
    "Level up your career with INSYT Corporate. Master banking, management trainee tracks, business analytics, corporate skills, and AI productivity.",
  keywords: [
    "career development",
    "corporate training",
    "banking preparation",
    "management trainee",
    "business skills",
    "professional development",
    "AI productivity",
    "MTO preparation",
    "INSYT Corporate",
  ],
  authors: [{ name: "INSYT" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "INSYT Corporate",
    title: "INSYT Corporate — The Career Operating System",
    description:
      "Level up your career. Master banking, MTO tracks, business analytics, and executive skills.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "INSYT Corporate — The Career Operating System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "INSYT Corporate",
    description: "The Career Operating System.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "INSYT Corporate",
  },
};

import { LanguageProvider } from "@/components/providers/language-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('insyt-corp-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.classList.add(t);}catch(e){}})();`,
          }}
        />
        {/* #48: Dynamic theme-color for browser chrome */}
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#080C14" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FAFBFC" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jetbrainsMono.variable} ${volteBangla.variable} min-h-screen font-sans antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <LanguageProvider>
              <UserProvider>
                {children}
              </UserProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
