"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import HexTextAnimation from "../HexAnimation/HexAnimation";
import styles from "./Projects.module.css";

import morningGGBridge from "@/imgs/Morning_GG_Bridge.png";
import liveGGBridge from "@/imgs/Live_GG_Bridge.png";
import eveningGGBridge from "@/imgs/Evening_GG_Bridge.png";
import nightGGBridge from "@/imgs/Night_GG_Bridge.png";

export type Project = {
  title: string;
  description: string;
  color: string;
  github: string;
  status: "Running" | "Completed";
  tags?: string[];
  images?: { src: StaticImageData; alt: string }[]; // any number, click through in a stacked gallery
};

export const graphicsProjects: Project[] = [
  {
    title: "Procedural Golden Gate",
    description: "The real-time 3D landing page of this site: an endless, procedurally generated Golden Gate Bridge built entirely in code with three.js. Chunks stream in and out through a fixed instance pool so the whole bridge draws in five draw calls, while the sky, sun, moon, fog and lighting follow the actual current time in San Francisco. Custom GLSL drives the analytic height fog, the Fresnel ocean and the night-time lamp glow.",
    color: "#ff5a3c",
    github: "https://github.com/aditya-s3n/aditya-sen.com/tree/main/src/components/Procedural3D",
    status: "Completed",
    tags: ["three.js", "Procedural Generation", "Instanced Rendering", "Custom GLSL", "Height Fog", "Real-time Sky"],
    images: [
      { src: liveGGBridge, alt: "Procedural Golden Gate Bridge at the live San Francisco time" },
      { src: morningGGBridge, alt: "Procedural Golden Gate Bridge in the morning" },
      { src: eveningGGBridge, alt: "Procedural Golden Gate Bridge at golden hour" },
      { src: nightGGBridge, alt: "Procedural Golden Gate Bridge at night with the street lamps on" },
    ],
  },
  {
    title: "PBR - Raytracing",
    description: "A CPU-based path tracer built from scratch, following Ray Tracing in One Weekend. Implements Lambertian, metal, and dielectric materials with physically accurate light scattering, anti-aliasing via supersampling, and a thin-lens camera model for depth-of-field effects.",
    color: "#b347d9",
    github: "https://github.com/aditya-s3n/Raytracing",
    status: "Completed",
    tags: ["Path Tracing", "PBR Materials", "Supersampling", "Depth of Field"],
  },
  {
    title: "3D Rasterization Rendering",
    description: "A software rasterizer built entirely from scratch, with no graphics API dependency. Parses OBJ mesh files and renders wireframe geometry using a custom Bresenham line algorithm and perspective camera projection.",
    color: "#ffdd44",
    github: "https://github.com/aditya-s3n/3D-Renderer",
    status: "Running",
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
    status: "Running",
  },
  {
    title: "NASA - Twitter Bot",
    description: "Tweet me a Universe is a custom Node.js bot that randomly selects an image from NASA's database, and posts the media as a tweet. Using NASA API, Twitter API, streaming BLOB data, it is able to consistently post an image at 7AM EST for over 1000 days.",
    color: "#00d4ff",
    github: "https://github.com/aditya-s3n/tweet-me-a-universe",
    status: "Completed",
  },
  {
    title: "Python - Email Automation",
    description: "An SMTP Python emailer, able to take in a csv file of emails / data. Shifting through the data to send out tailored emails based on the data provided in the CSV file.",
    color: "#ef4444",
    github: "https://github.com/aditya-s3n/Email-Automation",
    status: "Completed",
  },
];

type GalleryProps = {
  images: NonNullable<Project["images"]>;
};

// One image at a time, with cards peeking out behind it. Click to cycle.
function Gallery({ images }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const image = images[index];
  const behind = Math.min(images.length - 1, 2);

  return (
    <div className={styles.gallery} style={{ "--behind": behind } as React.CSSProperties}>
      {Array.from({ length: behind }, (_, layer) => (
        <span key={layer} className={styles.galleryLayer} style={{ "--layer": layer + 1 } as React.CSSProperties} aria-hidden="true" />
      ))}

      <button
        type="button"
        className={styles.galleryFrame}
        onClick={() => setIndex((index + 1) % images.length)}
        disabled={images.length < 2}
        aria-label={`${image.alt}. Image ${index + 1} of ${images.length}, click for next`}
      >
        <Image
          key={index}
          src={image.src}
          alt={image.alt}
          className={styles.galleryImage}
          sizes="(max-width: 991px) 100vw, 33vw"
          placeholder="blur"
        />
        {images.length > 1 && (
          <span className={styles.galleryCounter}>
            {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        )}
      </button>
    </div>
  );
}

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

        {project.images && project.images.length > 0 && (
          <Gallery images={project.images} />
        )}

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceButton}
            data-augmented-ui="tl-clip br-clip border"
          >
            <i className="bi bi-github" /> Read source
          </a>
        )}
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

// A chip package: laser-etched header, then its cores
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
            <CpuCore key={project.title} project={project} coreId={firstCoreId + index} cluster={cluster} featured={featured} />
          ))}
        </div>
      </div>
    </div>
  );
}
