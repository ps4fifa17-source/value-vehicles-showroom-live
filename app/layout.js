import "./globals.css";

export const metadata = {
  title: "Value Vehicles | Digital Showroom",
  description: "Premium interactive vehicle viewing.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
