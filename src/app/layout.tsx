import 'bootstrap/dist/css/bootstrap.min.css';
import BootstrapClient from '../components/BootstrapClient';

import type { Metadata } from "next";
import { Play } from "next/font/google";
import localFont from "next/font/local";
import Navbar from '@/components/Navbar/Navbar';

const play = Play({
  variable: "--font-play",
  subsets: ["latin"],
  weight: ["400", "700"]
});

const brotherSignature = localFont({
  src: '../fonts/BrotherSignature.otf',
  variable: '--font-brother-signature'
});


export const metadata: Metadata = {
  title: "Aditya Sen",
  description: "Personal portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${play.variable} ${brotherSignature.variable}`}>
        <Navbar />
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
