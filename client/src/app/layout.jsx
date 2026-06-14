import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "GLPDDP",
  description: "Golgattam Lakad Pattam De Danadan Pratiyogita",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
