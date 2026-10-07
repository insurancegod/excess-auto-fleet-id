import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Excess Auto Fleet ID",
  description: "Fleet VIN management with Corgi decoder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
