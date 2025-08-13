"use client";

import HexTextAnimation from "../HexAnimation/HexAnimation";
import styles from "./About.module.css";

const interests = [
    { name: "Automotive", color: "#ef4444", className: "automotive" },
    { name: "Cybersecurity", color: "#59EEF4", className: "cybersecurity" },
    { name: "Gaming", color: "#b347d9", className: "gaming" },
    { name: "Finance", color: "#ffdd44", className: "finance" },
]

const passions = [
    { name: "Driving & Working on Cars", color: "#ef4444", className: "driving" },
    { name: "Art - Books 📖 | Video Games 🎮 | Movies 🎥", color: "#59EEF4", className: "art" },
    { name: "Running & Biking", color: "#b347d9", className: "run" },
    { name: "Of Course! Computers 💕", color: "#ffdd44", className: "computing" },
]


export default function About() {
    return (
        <div className="pt-5" >
            <h1 className={styles.aboutColor}>About</h1>
            <div className={`w-100 border-top ${styles.aboutColor} mb-3`}></div>

            <div>
                <p className={styles.aboutText}>Currently a second-year <span className={styles.highlightAbout}>Computer Engineering</span> student at the <span className={styles.highlightAbout}>University of Waterloo.</span></p>

                <p className={styles.aboutText}>I love computers! If you couldn't already tell with the cyberpunk themed website. <br></br> Learning as much as I can from low-level firmware to high-level software. </p> 
            </div>

            <div>
                {/* Contributions and Passions Grid */}
                <div className="row g-4 mt-4">
                    {/* Contributions */}
                    <div className="col-md-6">
                    <div className={`p-4 ${styles.section} ${styles.contributionsSection}`}>
                        <HexTextAnimation className={`fs-5 mb-3 text-center ${styles.sectionTitle1}`} text="GOALS" duration={2} delay={0.5} />
                        <p className="mb-3 text-center">Industries I aim to contribute to:</p>
                        <div className="d-flex flex-column gap-2">
                        {interests.map((interest, index) => (
                            <div
                            key={interest.name}
                            className={`d-flex align-items-center justify-content-center gap-3 py-2 ${styles.tab} ${styles[interest.className]}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                            >
                            <div className={styles.tabGloss} />
                            <span className={`small text-center fst-italic ${styles.tabText}`}>{interest.name}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>

                    {/* Passions */}
                    <div className="col-md-6">
                    <div className={`p-4 ${styles.section} ${styles.passionsSection}`}>
                        <HexTextAnimation className={`fs-5 mb-3 text-center ${styles.sectionTitle2}`} text="PASSIONS" duration={2} delay={0.5} />
                        <p className="mb-3 text-center">Personal interests and hobbies:</p>
                        <div className="d-flex flex-column gap-2">
                        {passions.map((passion, index) => (
                            <div
                            key={passion.name}
                            className={`d-flex align-items-center justify-content-center gap-3 py-2 ${styles.tab} ${styles[passion.className]}`}
                            >
                            <div className={styles.tabGloss} />
                            <span className={`small fst-italic text-center ${styles.tabText}`}>{passion.name}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>
                </div>

            </div>

            <div className="mt-5">
                <p className={styles.aboutText}>Love so many types of art, those are just my top 3.</p>
                <p className={styles.aboutText}>Looking to get my own motorcycle 🏍️💨!!! :)</p>
                <p className={styles.aboutText}>I like all types of engineering! Checkout out some of my <a href="#" className={styles.aboutLink}><span className="text-decoration-underline">3D CAD designs here</span> <i className="bi bi-box-arrow-up-right"></i></a></p>
            </div>
        </div>
    )
} 