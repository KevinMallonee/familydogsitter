import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import FloatingShapes from '@/components/FloatingShapes';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Family Dog Sitter - Professional Dog Care in Sacramento Area',
  description: 'Professional, caring dog sitting services you can trust. Serving Sacramento, Folsom, Rancho Cordova, Roseville, Rocklin, El Dorado Hills & surrounding areas.',
  keywords: 'dog sitting, pet care, Sacramento, Folsom, Rancho Cordova, Roseville, Rocklin, El Dorado Hills',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <FloatingShapes />
          <NavBar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
} 