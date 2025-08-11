import styles from "./About.module.css";

export default function About() {
    return (
        <div className="pt-5" >
            <h1 className={styles.aboutColor}>About</h1>
            <div className={`w-100 border-top ${styles.aboutColor} mb-3`}></div>

            <div>
                <p>Currently a second-year <span>Computer Engineering</span> student at the <span>University of Waterloo.</span></p>

                <p>I love computers! If you already couldn't tell with the cyberpunk themed website. Learning everything from low-level firmware to high-level software. </p> 
            </div>

            <div>
                <p>I like all types of engineering! Checkout out some of my <a href="#">3D CAD designs here <i className="bi bi-box-arrow-up-right"></i></a></p>
            </div>
        </div>
    )
}