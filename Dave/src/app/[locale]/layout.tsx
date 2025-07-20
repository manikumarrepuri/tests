import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Job Search - Find 144,492 UK jobs on CV-Library",
  description:
    "Start your job search with 144,492 live UK vacancies on award-winning CV-Library. Register your CV and find local jobs near you today!",
  openGraph: {
    url: "https://www.cv-library.co.uk",
    title: "CV-Library",
    description: "Job Search - Find UK jobs on www.cv-library.co.uk",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body className={`${openSans.variable}`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
