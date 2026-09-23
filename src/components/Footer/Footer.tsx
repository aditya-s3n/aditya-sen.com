'use client';
import styles from "./Footer.module.css";
import Circuit from "@/components/Circuit/Circuit";

export default function Footer() {
    const year = new Date().getFullYear();


    return (
        <footer className={`text-center pt-3 pb-3 ${styles.footerContainer}`}>
                <Circuit className={styles.circuitLeft} />
                <Circuit className={styles.circuitRight} />
                <div className="row container m-auto">
                    <div className="col text-start">
                        <h5 className={`${styles.footerText}`}>Made by Aditya Sen</h5>
                    </div>

                    <div className="col text-center">
                        <a href="#" className={`${styles.footerText}`}>Back to the top <i className="bi bi-arrow-up"></i></a>
                    </div>

                    <div className="col text-end">
                        <h5 className={`${styles.footerText}`}>{year}</h5>
                    </div>
                </div>
        </footer>

    
  );
}
