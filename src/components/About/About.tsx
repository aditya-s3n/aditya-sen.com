"use client";

import Image from "next/image";
import HexTextAnimation from "../HexAnimation/HexAnimation";
import profile from "@/imgs/profile.jpg";
import { RESUME_URL } from "../links";
import styles from "./About.module.css";

const stats = [
    { label: "CLASS", value: "Graphics & Rendering" },
    { label: "PROGRAM", value: "Computer Engineering" },
    { label: "ORIGIN", value: "University of Waterloo" },
    { label: "YEAR", value: "3rd" },
];

const interests = [
    { name: "Automotive", icon: "bi-car-front-fill", color: "#ef4444" },
    { name: "Cybersecurity", icon: "bi-shield-lock-fill", color: "#59EEF4" },
    { name: "Gaming", icon: "bi-controller", color: "#b347d9" },
    { name: "Finance", icon: "bi-graph-up-arrow", color: "#ffdd44" },
];

const passions = [
    { name: "Driving & Working on Cars", icon: "bi-wrench-adjustable", color: "#ef4444" },
    { name: "Art", detail: "Books · Video Games · Movies", icon: "bi-palette-fill", color: "#59EEF4" },
    { name: "Running & Biking", icon: "bi-bicycle", color: "#b347d9" },
    { name: "Of Course! Computers", icon: "bi-cpu-fill", color: "#ffdd44" },
];

const loadout = [
    {
        title: "PC Build",
        caption: "See the specs",
        icon: "bi-pc-display",
        href: "https://ca.pcpartpicker.com/b/RLfv6h",
    },
    {
        title: "3D CAD Designs",
        caption: "I like all types of engineering!",
        icon: "bi-box",
        href: "https://drive.google.com/drive/folders/1m_l11mimNXIqmZlXha4vqFqzNAXGIOkQ?usp=sharing",
    },
    {
        title: "Resume",
        caption: "Full spec sheet",
        icon: "bi-file-earmark-person",
        href: RESUME_URL,
    },
];

type Chip = { name: string; icon: string; color: string; detail?: string };

function ChipGrid({ items }: { items: Chip[] }) {
    return (
        <div className={styles.chipGrid}>
            {items.map((item, index) => (
                <div
                    key={item.name}
                    className={styles.chip}
                    style={{ "--accent": item.color } as React.CSSProperties}
                    data-augmented-ui="tl-clip br-clip border"
                >
                    <span className={styles.chipIndex}>0x0{index + 1}</span>
                    <i className={`bi ${item.icon} ${styles.chipIcon}`} />
                    <span className={styles.chipName}>{item.name}</span>
                    {item.detail && <span className={styles.chipDetail}>{item.detail}</span>}
                </div>
            ))}
        </div>
    );
}

export default function About() {
    return (
        <section className="pt-5">
            <div className={styles.header}>
                <span className={styles.headerIndex}>{"// 01"}</span>
                <HexTextAnimation className={`mb-0 ${styles.headerTitle}`} text="ABOUT" duration={1} />
                <div className={styles.headerLine} />
            </div>

            <div className="row g-4 mt-2">
                <div className="col-lg-5">
                    <div className={`${styles.panel} ${styles.idCard}`} data-augmented-ui="tl-clip br-clip border">
                        <div className={styles.panelTag}>ID // PLAYER_01</div>

                        <div className={`profile-image-wrapper holocall-auto ${styles.portrait}`} data-augmented-ui="r-clip-y both">
                            <Image
                                src={profile}
                                alt="Aditya Sen"
                                className={styles.portraitImage}
                                sizes="(max-width: 992px) 100vw, 400px"
                                priority
                            />
                        </div>

                        <p className={styles.name}>Aditya Sen</p>
                        <div className={`landing-subtext-container ${styles.role}`} data-augmented-ui="bl-clip-y tr-clip-y border">
                            <HexTextAnimation text="Graphics & Rendering Engineer" className="landing-subtext mb-0" duration={2} delay={0.5} />
                        </div>

                        <dl className={styles.stats}>
                            {stats.map((stat) => (
                                <div key={stat.label} className={styles.statRow}>
                                    <dt>{stat.label}</dt>
                                    <dd>{stat.value}</dd>
                                </div>
                            ))}
                            <div className={styles.statRow}>
                                <dt>STATUS</dt>
                                <dd><span className={styles.statusDot} />Online</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="col-lg-7 d-flex flex-column gap-4">
                    <div className={`${styles.panel} ${styles.terminal}`} data-augmented-ui="tr-clip bl-clip border">
                        <div className={styles.terminalBar}>
                            <span className={styles.terminalDots}><i /><i /><i /></span>
                            <span className={styles.terminalPath}>~/aditya/about.txt</span>
                        </div>
                        <div className={styles.terminalBody}>
                            <p><span className={styles.prompt}>&gt;</span> whoami</p>
                            <p className={styles.bio}>
                                Currently a third-year <span className={styles.highlight}>Computer Engineering</span> student
                                at the <span className={styles.highlight}>University of Waterloo</span>.
                            </p>
                            <p className={styles.bio}>
                                I love computers! If you couldn&apos;t already tell from the cyberpunk themed website.
                                Learning as much as I can, from low-level firmware to high-level software.
                            </p>
                            <p className="mb-0"><span className={styles.prompt}>&gt;</span> <span className={styles.caret} /></p>
                        </div>
                    </div>

                    <div className={styles.loadoutGrid}>
                        {loadout.map((item) => (
                            <a
                                key={item.title}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.loadoutCard}
                                data-augmented-ui="tr-clip bl-clip border"
                            >
                                <i className={`bi ${item.icon} ${styles.loadoutIcon}`} />
                                <span>
                                    <span className={styles.loadoutTitle}>{item.title} <i className="bi bi-box-arrow-up-right" /></span>
                                    <span className={styles.loadoutCaption}>{item.caption}</span>
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="row g-4 mt-2">
                <div className="col-md-6">
                    <div className={`${styles.panel} ${styles.goals}`} data-augmented-ui="tr-clip-y br-clip-y border">
                        <HexTextAnimation className={`fs-5 mb-1 ${styles.panelTitle}`} text="GOALS" duration={1} delay={0.3} />
                        <p className={styles.panelSubtitle}>Industries I aim to contribute to</p>
                        <ChipGrid items={interests} />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className={`${styles.panel} ${styles.passions}`} data-augmented-ui="tl-clip-y bl-clip-y border">
                        <HexTextAnimation className={`fs-5 mb-1 ${styles.panelTitle}`} text="PASSIONS" duration={1} delay={0.3} />
                        <p className={styles.panelSubtitle}>Personal interests and hobbies</p>
                        <ChipGrid items={passions} />
                    </div>
                </div>
            </div>
        </section>
    );
}
