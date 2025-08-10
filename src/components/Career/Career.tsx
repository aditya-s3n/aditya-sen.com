import CareerSection from "./CareerSection";
import styles from "./Career.module.css";

export default function Career() {
    return (
        <div className="pt-5" id="career">
            <h1 className="career-color">Career</h1>
            <div className="w-100 border-top career-color"></div>
            <a href="#"><span>Resume</span> <i className="bi bi-box-arrow-up-right"></i></a>

            <CareerSection />
        </div>
    );
}