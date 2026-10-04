import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CompareTray from "@/components/compare/CompareTray";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hamro College | हाम्रो कलेज — Compare colleges with real costs in NPR",
    template: "%s | Hamro College",
  },
  description:
    "Verified college directory for Nepali students. Compare colleges in Nepal, India, Australia, Canada, UK, USA and Japan with total costs in Nepalese Rupees, verified reviews and step-by-step NOC guides.",
  openGraph: {
    title: "Hamro College | हाम्रो कलेज",
    description: "Compare colleges with real costs in NPR — made for Nepali students and parents.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CompareTray />
      </body>
    </html>
  );
}
