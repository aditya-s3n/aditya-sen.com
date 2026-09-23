import HexTextAnimation from '@/components/HexAnimation/HexAnimation';
import Image from 'next/image';
import logo from '@/imgs/profile.jpg';
import About from '@/components/About/About';


export default function AdityaPage() {
  return (
    <div>
      <div className='container my-5'>
        <div className='row'>
          <div className='col text-center text-md-start mb-4'>
            <div className="profile-image-wrapper" data-augmented-ui="r-clip-y both">
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

            <div 
              className='row py-2 text-center landing-subtext-container w-75'
              data-augmented-ui="bl-clip-y tr-clip-y border"
            >
              <HexTextAnimation text='Graphics & Rendering Engineer' className='col responsive-border landing-subtext mb-0' duration={2} delay={0.5}/>
            </div>
          </div>
        </div>


        <div className='mt-5'>
          <About />
        </div>

      </div>
    </div>
  );
}
