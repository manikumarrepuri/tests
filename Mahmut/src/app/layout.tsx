import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../App.scss';
import I18nProvider from '../components/I18nProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'React CV Library',
  description: 'A CV library built with React and Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
