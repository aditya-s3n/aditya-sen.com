"use client";

import { graphicsProjects, otherProjects } from "./ProjectCard";
import styles from "./Projects.module.css";

const allProjects = [
  ...graphicsProjects.map((project) => ({ ...project, cluster: "GFX" })),
  ...otherProjects.map((project) => ({ ...project, cluster: "GEN" })),
];

export default function TaskManager() {
  return (
    <div className={styles.taskManager} data-augmented-ui="tl-clip br-clip border">
      <div className={styles.tmBar}>
        <span className={styles.tmTitle}><i className="bi bi-cpu" /> Task Manager</span>
        <span className={styles.tmControls} aria-hidden="true"><i className="bi bi-dash" /><i className="bi bi-square" /><i className="bi bi-x" /></span>
      </div>

      <div className={styles.tmTabs}>
        <span className={`${styles.tmTab} ${styles.tmTabActive}`}>processes</span>
      </div>

      <div className={styles.tmTableWrap}>
        <table className={styles.tmTable}>
          <thead>
            <tr>
              <th>Core</th>
              <th>Name</th>
              <th>Package</th>
              <th>Status</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {allProjects.map((project, index) => (
              <tr key={project.title} style={{ "--accent": project.color } as React.CSSProperties}>
                <td>{String(index).padStart(2, "0")}</td>
                <td className={styles.tmName}>{project.title}</td>
                <td>{project.cluster}</td>
                <td><span className={project.status === "Running" ? styles.tmRunning : styles.tmCompleted} />{project.status}</td>
                <td>
                  <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source on GitHub`}>
                    <i className="bi bi-github" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
