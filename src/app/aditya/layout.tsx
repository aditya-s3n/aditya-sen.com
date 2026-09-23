import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Background from '@/components/Background/Background';
import CitySkyline from '@/components/CitySkyline/CitySkyline';
import CityLights3D from '@/components/CityLights3D/CityLights3D';
import '../styles/background.css';
import '../styles/styles.css';

export default function AdityaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Background />
      {/* <CityLights3D /> */}
      <CitySkyline />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}
