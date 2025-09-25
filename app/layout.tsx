import "@/app/globals.css";

import Providers from "./providers";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // pick what you need
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body className={font.className}>{children}</body>
      </html>
    </Providers>
  );
}
