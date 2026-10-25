'use client';
import styles from "./Footer.module.css";
import Circuit from "@/components/Circuit/Circuit";
import Glitch from "@/components/Glitch/Glitch";

export default function Footer() {
    const year = new Date().getFullYear();


    return (
        <footer className={`text-center pt-3 pb-3 ${styles.footerContainer}`}>
                <Circuit className={styles.circuitLeft} />
                <Circuit className={styles.circuitRight} />
                <div className="row container m-auto">
                    <div className="col-6 col-md text-start order-1">
                        <h5 className={`${styles.footerText}`}><Glitch text="Made by Aditya Sen" /></h5>
                    </div>

                    <div className="col-12 col-md text-center order-3 order-md-2 mt-3 mt-md-0">
                        <a href="#" className={`${styles.footerText}`}>Back to the top <i className="bi bi-arrow-up"></i></a>
                    </div>

                    <div className="col-6 col-md text-end order-2 order-md-3">
                        <h5 className={`${styles.footerText}`}>{year}</h5>
                    </div>
                </div>
        </footer>

    
  );
}
