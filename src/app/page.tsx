import HexTextAnimation from '@/components/HexAnimation/HexAnimation';

import './styles/background.css';
import './styles/styles.css';


export default function Home() {
  return (
    <div>
      <div className='container'>
        <div className='row'>
          <div className='col'>

          </div>

          <div className='col text-center'>
            <p className='fs-1 name'>Aditya Sen</p>

            <div className='container d-flex justify-content-center align-items-center landing-subtext-container'>
              <HexTextAnimation text='Software Engineer' className='fs-5' duration={2.5} delay={0.5}/>
              <p className='fs-5 mx-3'>|</p>
              <HexTextAnimation text='Firmware Engineer' className='fs-5' duration={2.5} delay={0.5}/>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
