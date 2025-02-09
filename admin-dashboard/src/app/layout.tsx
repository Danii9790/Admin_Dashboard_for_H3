import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Furniro",
  description: "Made By Danii",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}  data-new-gr-c-s-check-loaded="14.1221.0"
 data-gr-ext-installed="">
        
        {children}
        
      </body>
    </html>
  );
}
