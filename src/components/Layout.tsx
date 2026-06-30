import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../css/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className="layout-main">
        {children}
      </main>
      <Footer />
    </>
  );
}