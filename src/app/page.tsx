import HexTextAnimation from '@/components/HexAnimation/HexAnimation';
import Image from 'next/image';
import logo from '@/imgs/profile.jpg';
import Background from '@/components/Background/Background';
import './styles/background.css';
import './styles/styles.css';


export default function Home() {
  return (
    <div>
      <Background />
      <div className='container'>
        <div className='row'>
          <div className='col'>
            {/* <Image 
              src={logo}
              alt='profile'
              width={500}
              height={500}
            /> */}
          </div>

          <div className='col text-center'>
            <p className='fs-1 name'>Aditya Sen</p>

            <div className='row py-2 text-center m-auto landing-subtext-container'>
              <HexTextAnimation text='Software Engineer' className='col landing-subtext' duration={2} delay={0.5}/>
              <HexTextAnimation text='Firmware Engineer' className='col landing-subtext' duration={2} delay={0.5}/>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
