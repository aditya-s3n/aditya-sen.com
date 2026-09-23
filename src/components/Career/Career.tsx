"use client";

import HexTextAnimation from "../HexAnimation/HexAnimation";
import CareerSection, { careers, durationInMonths } from "./CareerSection";
import { RESUME_URL } from "../links";
import styles from "./Career.module.css";

const firstBoot = careers[careers.length - 1].duration.split(" - ")[0];
const totalMonths = careers.reduce((sum, career) => sum + durationInMonths(career.duration), 0);
const vendors = new Set(careers.map((career) => career.company)).size;

const postLines = [
    { label: "Memory test", value: `${careers.length} modules detected` },
    { label: "Unique vendors", value: `${vendors}` },
    { label: "Total capacity", value: `${totalMonths} MO` },
    { label: "Latest module", value: careers[0].company },
    { label: "First boot", value: firstBoot },
];

export default function Career() {
    return (
        <section className="pt-5">
            <div className={styles.header}>
                <span className={styles.headerIndex}>{"// 02"}</span>
                <HexTextAnimation className={`mb-0 ${styles.headerTitle}`} text="CAREER" duration={1} />
                <div className={styles.headerLine} />
            </div>

            <div className="row g-4 mt-2">
                <div className="col-lg-8">
                    <div className={styles.bios} data-augmented-ui="tl-clip br-clip border">
                        <div className={styles.biosBar}>
                            <span>SEN-BIOS v2.0</span>
                            <span className="d-none d-sm-inline">POST // MEMORY CHECK</span>
                        </div>
                        <div className={styles.biosBody}>
                            {postLines.map((line) => (
                                <div
                                    key={line.label}
                                    className={styles.biosLine}
                                >
                                    <span className={styles.biosLabel}>{line.label}</span>
                                    <span className={styles.biosDots} />
                                    <span className={styles.biosValue}>{line.value}</span>
                                </div>
                            ))}
                            <p
                                className={styles.biosStatus}
                            >
                                [ <span className={styles.ok}>OK</span> ] All modules operational <span className={styles.caret} />
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <a
                        href={RESUME_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resumeCard}
                        data-augmented-ui="tr-clip bl-clip border"
                    >
                        <i className={`bi bi-file-earmark-person ${styles.resumeIcon}`} />
                        <span className={styles.resumeTitle}>Resume <i className="bi bi-box-arrow-up-right" /></span>
                        <span className={styles.resumeCaption}>Full spec sheet</span>
                    </a>
                </div>
            </div>

            <CareerSection />
        </section>
    );
}
