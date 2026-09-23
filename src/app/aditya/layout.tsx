import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Background from '@/components/Background/Background';
import CitySkyline from '@/components/CitySkyline/CitySkyline';
import '../styles/background.css';
import '../styles/styles.css';

export default function AdityaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <Background />
      <CitySkyline />
      {children}
      <Footer />
    </>
  );
}
