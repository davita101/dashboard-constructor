import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { RememberMeGuard } from "@/components/auth/remember-me";
import { ComingSoon } from "@/components/layout/ComingSoon";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Suspense } from "react";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { themeInitScript } from "@/components/dashboard/theme-script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Commerce Constructor", template: "%s · Commerce Constructor" },
  description: "Projects, files, notes and team workspace.",
};

// Locale comes from a cookie, so this reads request data: keep it in its own Suspense boundary (cacheComponents is on).
async function IntlProvider({ children }: { children: React.ReactNode }) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={{ theme: shadcn }}>
          <RememberMeGuard />
          <Suspense>
            <IntlProvider>
              {children}
              <ComingSoon />
            </IntlProvider>
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}