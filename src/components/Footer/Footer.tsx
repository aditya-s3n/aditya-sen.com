'use client';

export default function Footer() {
    const year = new Date().getFullYear();


    return (
        <footer className="">
                <div className="row">
                    <div className="col">
                        <h5>Made by Aditya Sen</h5>
                    </div>

                    <div className="col">
                        <a href="#">Back to the top <i className="bi bi-arrow-up"></i></a>
                    </div>

                    <div className="col">
                        <h5>{year}</h5>
                    </div>
                </div>
        </footer>

    
  );
}
