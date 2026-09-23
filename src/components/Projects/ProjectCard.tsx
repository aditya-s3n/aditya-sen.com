"use client";

import { Fragment } from "react";
import HexTextAnimation from "../HexAnimation/HexAnimation";
import styles from "./Projects.module.css";

export type Project = {
  title: string;
  description: string;
  color: string;
  github: string;
  tags?: string[];
};

export const graphicsProjects: Project[] = [
  {
    title: "PBR - Raytracing",
    description: "A CPU-based path tracer built from scratch, following Ray Tracing in One Weekend. Implements Lambertian, metal, and dielectric materials with physically accurate light scattering, anti-aliasing via supersampling, and a thin-lens camera model for depth-of-field effects.",
    color: "#b347d9",
    github: "https://github.com/aditya-s3n/Raytracing",
    tags: ["Path Tracing", "PBR Materials", "Supersampling", "Depth of Field"],
  },
  {
    title: "3D Rasterization Rendering",
    description: "A software rasterizer built entirely from scratch, with no graphics API dependency. Parses OBJ mesh files and renders wireframe geometry using a custom Bresenham line algorithm and perspective camera projection.",
    color: "#ffdd44",
    github: "https://github.com/aditya-s3n/3D-Renderer",
    tags: ["Software Rasterizer", "OBJ Parsing", "Bresenham", "Perspective Projection"],
  },
];

export const otherProjects: Project[] = [
  {
    title: "Scarlet Encryption",
    description:
      "Scarlet Encryption is a file encryption tool that allows users to securely encrypt and decrypt files on their local storage. It supports AES for encryption, SHA-256 for file integrity, RSA for hashing the AES key.",
    color: "#f97316",
    github: "https://github.com/aditya-s3n/scarlet_encryption",
  },
  {
    title: "NASA - Twitter Bot",
    description: "Tweet me a Universe is a custom Node.js bot that randomly selects an image from NASA's database, and posts the media as a tweet. Using NASA API, Twitter API, streaming BLOB data, it is able to consistently post an image at 7AM EST for over 1000 days.",
    color: "#00d4ff",
    github: "https://github.com/aditya-s3n/tweet-me-a-universe",
  },
  {
    title: "Python - Email Automation",
    description: "An SMTP Python emailer, able to take in a csv file of emails / data. Shifting through the data to send out tailored emails based on the data provided in the CSV file.",
    color: "#ef4444",
    github: "https://github.com/aditya-s3n/Email-Automation",
  },
];

type CpuCoreProps = {
  project: Project;
  coreId: number;
  cluster: string;
  featured?: boolean;
};

function CpuCore({ project, coreId, cluster, featured = false }: CpuCoreProps) {
  return (
    <article
      className={`${styles.core} ${featured ? styles.coreFeatured : ""}`}
      style={{ "--accent": project.color } as React.CSSProperties}
      data-augmented-ui="tl-clip br-clip border"
    >
      <div className={styles.coreHead}>
        <span className={styles.pinOne} aria-hidden="true" />
        <span>CORE {String(coreId).padStart(2, "0")}</span>
        <span className={styles.coreCluster}>{cluster}</span>
        <span className={styles.coreLed} aria-hidden="true" />
      </div>

      <div className={styles.coreBody}>
        <HexTextAnimation
          text={project.title}
          className={`fw-bold mb-3 ${styles.coreTitle}`}
          delay={0.3}
          duration={1.5}
        />
        <p className={styles.coreDescription}>{project.description}</p>

        {project.tags && (
          <ul className={styles.tags}>
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        )}

        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.sourceButton}
          data-augmented-ui="tl-clip br-clip border"
        >
          <i className="bi bi-github" /> Read source
        </a>
      </div>

      <div className={styles.corePads} aria-hidden="true" />
    </article>
  );
}

type CpuPackageProps = {
  projects: Project[];
  firstCoreId: number;
  cluster: string;
  partName: string;
  title: string;
  caption: string;
  featured?: boolean;
};

// A chip package: laser-etched header, then its cores joined by bus traces
export default function CpuPackage({ projects, firstCoreId, cluster, partName, title, caption, featured = false }: CpuPackageProps) {
  return (
    <div className={`${styles.package} ${featured ? styles.packageFeatured : ""}`}>
      <div className={styles.die} data-augmented-ui="tl-clip tr-clip br-clip bl-clip border">
        <div className={styles.etch}>
          <div>
            <span className={styles.partName}>{partName}</span>
            <h2 className={styles.clusterTitle}>{title}</h2>
            <p className={styles.clusterCaption}>{caption}</p>
          </div>
          <span className={styles.coreCount}>{projects.length}C / {projects.length}T</span>
        </div>

        <div className={styles.coreRow}>
          {projects.map((project, index) => (
            <Fragment key={project.title}>
              {index > 0 && <div className={styles.bus} aria-hidden="true" />}
              <CpuCore project={project} coreId={firstCoreId + index} cluster={cluster} featured={featured} />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
