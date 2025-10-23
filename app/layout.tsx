import "@/app/globals.css";

import Providers from "./providers";
import { Nunito_Sans } from "next/font/google";

const font = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "500", '600',"700"], 
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
