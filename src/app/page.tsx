import HexTextAnimation from '@/components/HexAnimation/HexAnimation';
import Image from 'next/image';
import logo from '@/imgs/profile.jpg';
import Background from '@/components/Background/Background';
import Projects from '@/components/Projects/Projects';
import Career from '@/components/Career/Career';
import About from '@/components/About/About';
import './styles/background.css';
import './styles/styles.css';


export default function Home() {
  return (
    <div>
      <Background />
      <div className='container my-5'>
        <div className='row'>
          <div className='col text-center text-md-start mb-4'>
            <div className="profile-image-wrapper">
              <Image
                src={logo}
                alt="Aditya Sen"
                width={350}
                height={350}
                style={{
                  objectFit: 'cover',
                }}
                sizes="(max-width: 768px) 100vw, 350px"
                priority={true}
              />
            </div>

          </div>

          <div className='col d-flex flex-column justify-content-center align-items-center text-center'>
            <p className='fs-1 name'>Aditya Sen</p>

            <div className='row py-2 text-center landing-subtext-container w-100'>
              <HexTextAnimation text='Software Engineer' className='col responsive-border landing-subtext mb-0' duration={2} delay={0.5}/>
              <HexTextAnimation text='Firmware Engineer' className='col landing-subtext mb-0' duration={2} delay={0.5}/>
            </div>
          </div>
        </div>


        <div className='mt-5'>
          <Projects />
        </div>

        <div className='mt-5'>
          <Career />
        </div>

        <div className='mt-5'>
          <About />
        </div>
      </div>

      
    </div>
  );
}
