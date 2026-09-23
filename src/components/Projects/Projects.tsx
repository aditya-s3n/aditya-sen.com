"use client";

import HexTextAnimation from "../HexAnimation/HexAnimation";
import FloppyDisk, { graphicsProjects, otherProjects } from "./ProjectCard";
import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <section className="pt-5">
      <div className={styles.header}>
        <span className={styles.headerIndex}>{"// 03"}</span>
        <HexTextAnimation className={`mb-0 ${styles.headerTitle}`} text="PROJECTS" duration={1} />
        <div className={styles.headerLine} />
      </div>

      <div className={styles.driveHeader}>
        <span className={styles.driveLetter}>A:</span>
        <div>
          <h2 className={styles.driveTitle}>Graphics &amp; Rendering</h2>
          <p className={styles.driveCaption}>Renderers built from scratch, pixel by pixel</p>
        </div>
      </div>
      <div className={styles.featuredGrid}>
        {graphicsProjects.map((project, index) => (
          <FloppyDisk key={project.title} project={project} drive="A" index={index} featured />
        ))}
      </div>

      <div className={`${styles.driveHeader} ${styles.driveHeaderMinor}`}>
        <span className={styles.driveLetter}>B:</span>
        <div>
          <h2 className={styles.driveTitle}>Other Projects</h2>
          <p className={styles.driveCaption}>Tools, bots and automation</p>
        </div>
      </div>
      <div className={styles.diskGrid}>
        {otherProjects.map((project, index) => (
          <FloppyDisk key={project.title} project={project} drive="B" index={index} />
        ))}
      </div>
    </section>
  );
}
