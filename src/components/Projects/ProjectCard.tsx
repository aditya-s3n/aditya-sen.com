"use client";

import { motion } from "framer-motion";
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

type FloppyDiskProps = {
  project: Project;
  drive: string;
  index: number;
  featured?: boolean;
};

export default function FloppyDisk({ project, drive, index, featured = false }: FloppyDiskProps) {
  return (
    <motion.div
      className={`${styles.diskGlow} ${featured ? styles.featured : ""}`}
      style={{ "--accent": project.color } as React.CSSProperties}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <article className={styles.disk} data-augmented-ui="tr-clip border">
        <div className={styles.diskTop}>
          <span className={styles.led} aria-hidden="true" />
          <div className={styles.shutterTrack} aria-hidden="true">
            <div className={styles.platter} />
            <div className={styles.shutter}>
              <div className={styles.shutterWindow} />
            </div>
          </div>
          <span className={styles.capacity}>{featured ? "2.88" : "1.44"} MB</span>
        </div>

        <div className={styles.label}>
          <div className={styles.labelBand}>
            <span>{drive}:\{String(index + 1).padStart(2, "0")}</span>
            <span>{featured ? "HD // RENDER" : "DS // HD"}</span>
          </div>

          <div className={styles.labelBody}>
            <HexTextAnimation
              text={project.title}
              className={`fw-bold mb-3 ${styles.title}`}
              delay={0.3}
              duration={1.5}
            />
            <p className={styles.description}>{project.description}</p>

            {project.tags && (
              <ul className={styles.tags}>
                {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}

            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.readButton}
              data-augmented-ui="tl-clip br-clip border"
            >
              <i className="bi bi-github" /> Read source
            </a>
          </div>
        </div>

        <span className={styles.writeProtect} aria-hidden="true" />
        <span className={styles.densityHole} aria-hidden="true" />
      </article>
    </motion.div>
  );
}
