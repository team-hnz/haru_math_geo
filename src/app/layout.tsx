import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";

import localFont from "next/font/local";

const pretendard = localFont({
  src: [
    {
      path: "./fonts/PRETENDARD-BLACK.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/PRETENDARD-EXTRABOLD.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/PRETENDARD-BOLD.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/PRETENDARD-SEMIBOLD.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/PRETENDARD-MEDIUM.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/PRETENDARD-REGULAR.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/PRETENDARD-LIGHT.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/PRETENDARD-EXTRALIGHT.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "./fonts/PRETENDARD-THIN.otf",
      weight: "100",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={pretendard.className}>{children}</body>
    </html>
  );
}
