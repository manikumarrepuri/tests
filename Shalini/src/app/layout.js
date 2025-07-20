import { Open_Sans } from 'next/font/google';
import "./globals.scss";

const openSans = Open_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-open-sans', 
  display: 'swap', 
});
export const metadata = {
  title: "CV Test",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={openSans.variable}>
        {children}
      </body>
    </html>
  );
}
