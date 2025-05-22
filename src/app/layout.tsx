import type { Metadata } from "next";
import { Play } from "next/font/google";
import localFont from "next/font/local";

const play = Play({
  variable: "--font-play",
  subsets: ["latin"],
  weight: ["400", "700"]
});

const brotherSignature = localFont({
  src: './BrotherSignature.otf',
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
        {children}
      </body>
    </html>
  );
}
