import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";
import { RememberMeGuard } from "@/components/auth/remember-me";
import { ComingSoon } from "@/components/layout/ComingSoon";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Suspense } from "react";
import {
  Inter,
  Merriweather,
  Ms_Madi,
  Playfair_Display,
  Roboto,
  Source_Code_Pro,
} from "next/font/google";
import "./globals.css";
import { themeInitScript } from "@/components/dashboard/theme-script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const msMadi = Ms_Madi({
  variable: "--font-ms-madi",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  display: "swap",
});

const fontVariables = [
  inter,
  playfair,
  roboto,
  merriweather,
  msMadi,
  sourceCodePro,
]
  .map((font) => font.variable)
  .join(" ");

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
      className={`${fontVariables} h-full antialiased`}
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