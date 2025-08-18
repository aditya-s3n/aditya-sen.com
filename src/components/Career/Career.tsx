import CareerSection from "./CareerSection";
import styles from "./Career.module.css";

export default function Career() {
    return (
        <div className="pt-5">
            <h1 className={styles.careerColor}>Career</h1>
            <div className={`w-100 border-top ${styles.careerColor} mb-3`}></div>
            <a href="https://drive.google.com/drive/folders/1wrqDKua8Ck4BO3nhghAiD1aEfC4T-SRT?usp=sharing" target="_blank" rel="noopener noreferrer" className={styles.resumeText}><span className="text-decoration-underline">Resume</span> <i className="bi bi-box-arrow-up-right"></i></a>

            <CareerSection />
        </div>
    );
}