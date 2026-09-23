"use client";

import { useEffect, useState } from "react";
import { graphicsProjects, otherProjects } from "./ProjectCard";
import styles from "./Projects.module.css";

const POINTS = 40;
const allProjects = [
  ...graphicsProjects.map((project) => ({ ...project, cluster: "GFX" })),
  ...otherProjects.map((project) => ({ ...project, cluster: "GEN" })),
];

// Deterministic starting curve so server and client render the same graph
const initialLoad = Array.from({ length: POINTS }, (_, i) => 50 + 25 * Math.sin(i / 3) + 10 * Math.sin(i / 1.3));

function toPath(values: number[]) {
  return values.map((value, i) => `${(i / (POINTS - 1)) * 300},${100 - value}`).join(" ");
}

export default function TaskManager() {
  const [tab, setTab] = useState<"performance" | "processes">("performance");
  const [load, setLoad] = useState(initialLoad);

  // Decorative activity graph: random walk that scrolls like a real monitor
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setLoad((prev) => {
        const last = prev[prev.length - 1];
        const next = Math.min(95, Math.max(10, last + (Math.random() - 0.5) * 30));
        return [...prev.slice(1), next];
      });
    }, 900);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "Cores", value: allProjects.length },
    { label: "Packages", value: 2 },
    { label: "Graphics cores", value: graphicsProjects.length },
    { label: "General cores", value: otherProjects.length },
    { label: "Open source", value: `${allProjects.filter((p) => p.github).length}/${allProjects.length}` },
    { label: "Status", value: "Running" },
  ];

  return (
    <div className={styles.taskManager} data-augmented-ui="tl-clip br-clip border">
      <div className={styles.tmBar}>
        <span className={styles.tmTitle}><i className="bi bi-cpu" /> Task Manager</span>
        <span className={styles.tmControls} aria-hidden="true"><i className="bi bi-dash" /><i className="bi bi-square" /><i className="bi bi-x" /></span>
      </div>

      <div className={styles.tmTabs} role="tablist">
        {(["performance", "processes"] as const).map((name) => (
          <button
            key={name}
            role="tab"
            aria-selected={tab === name}
            className={`${styles.tmTab} ${tab === name ? styles.tmTabActive : ""}`}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>

      {tab === "performance" ? (
        <div className={styles.tmPerformance}>
          <div className={styles.tmGraphWrap}>
            <div className={styles.tmGraphLabel}>
              <span>CPU // SEN-PROJECTS</span>
              <span>{allProjects.length} cores online</span>
            </div>
            <svg className={styles.tmGraph} viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points={`0,100 ${toPath(load)} 300,100`} className={styles.tmGraphFill} />
              <polyline points={toPath(load)} className={styles.tmGraphLine} />
            </svg>
          </div>

          <dl className={styles.tmStats}>
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : (
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
                  <td><span className={styles.tmRunning} />Running</td>
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
      )}
    </div>
  );
}
