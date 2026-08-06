import type { Metadata } from 'next';
import '../src/index.css';

export const metadata: Metadata = {
  title: 'Travelo - #1 Call-to-Book Travel & Ticketing Agency in Bangladesh',
  description: 'Book flight tickets, custom tour packages, and fast visa processing directly via WhatsApp and Call with Travelo BD.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
