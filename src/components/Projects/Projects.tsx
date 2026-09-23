"use client";

import HexTextAnimation from "../HexAnimation/HexAnimation";
import CpuPackage, { graphicsProjects, otherProjects } from "./ProjectCard";
import TaskManager from "./TaskManager";
import styles from "./Projects.module.css";

export default function Projects() {
  return (
    <section className="pt-5">
      <div className={styles.header}>
        <span className={styles.headerIndex}>{"// 03"}</span>
        <HexTextAnimation className={`mb-0 ${styles.headerTitle}`} text="PROJECTS" duration={1} />
        <div className={styles.headerLine} />
      </div>

      <TaskManager />

      <CpuPackage
        projects={graphicsProjects}
        firstCoreId={0}
        cluster="GFX"
        partName="SEN-GFX // RENDER CLUSTER"
        title="Graphics Projects"
        caption="All my projects that I learned real-time and offline rendering"
        featured
      />

      <CpuPackage
        projects={otherProjects}
        firstCoreId={graphicsProjects.length}
        cluster="GEN"
        partName="SEN-GEN // GENERAL PURPOSE"
        title="Other Projects"
        caption="Tools, bots, and automation"
      />
    </section>
  );
}
