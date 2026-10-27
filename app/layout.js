import "./globals.css";

export const metadata = { title: "Sift", description: "Chat with your PDFs" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
