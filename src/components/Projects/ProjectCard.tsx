"use client"

import Link from "next/link"
import HexTextAnimation from "../HexAnimation/HexAnimation"

const projects = [
  {
    title: "Scarlet Encryption",
    description: "Scarlet Encryption is a file encryption tool that allows users to securely encrypt and decrypt files on their local storage. It supports AES for encryption, SHA-256 for file integrity, RSA for hashing the AES key.",
    color: "orange",
    github: "#",
    demo: "#",
  },
  {
    title: "NASA - Twitter Bot",
    description: "",
    color: "cyan",
    github: "#",
    demo: "#",
  },
  {
    title: "Test",
    description: "",
    color: "red",
    github: "#",
    demo: "#",
  },
]

const colorClasses = {
  purple: {
    border: "border-purple",
    bg: "bg-purple-dark",
    text: "text-purple",
    shadow: "shadow-purple",
    circuit: "#b347d9",
  },
  cyan: {
    border: "border-cyan",
    bg: "bg-cyan-dark",
    text: "text-cyan",
    shadow: "shadow-cyan",
    circuit: "#00d4ff",
  },
  yellow: {
    border: "border-yellow",
    bg: "bg-yellow-dark",
    text: "text-yellow",
    shadow: "shadow-yellow",
    circuit: "#ffdd44",
  },
  green: {
    border: "border-green",
    bg: "bg-green-dark",
    text: "text-green",
    shadow: "shadow-green",
    circuit: "#22c55e",
  },
  red: {
    border: "border-red",
    bg: "bg-red-dark",
    text: "text-red",
    shadow: "shadow-red",
    circuit: "#ef4444",
  },
  orange: {
    border: "border-orange",
    bg: "bg-orange-dark",
    text: "text-orange",
    shadow: "shadow-orange",
    circuit: "#f97316",
  },
}

export default function ProjectsSection() {
  return (
    <>
      <section id="projects" className="py-5">
        <div className="container">

          <div className="cyber-grid mb-5">
            {projects.map((project, index) => {
              const colors = colorClasses[project.color as keyof typeof colorClasses]

              return (
                <div key={project.title} className="project-card-container">
                  <div
                    className={`project-card ${colors.border} ${colors.bg} ${colors.shadow}`}
                  >
                    {/* Circuit Board Pattern */}
                    <div className="circuit-pattern">
                      <svg width="100%" height="100%" className="">
                        <defs>
                          <pattern id={`circuit-${index}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                            {/* Horizontal lines */}
                            <line x1="0" y1="20" x2="40" y2="20" stroke={colors.circuit} strokeWidth="1" opacity="0.3"/>
                            <line x1="0" y1="10" x2="20" y2="10" stroke={colors.circuit} strokeWidth="0.5" opacity="0.4"/>
                            <line x1="20" y1="30" x2="40" y2="30" stroke={colors.circuit} strokeWidth="0.5" opacity="0.4"/>
                            
                            {/* Vertical lines */}
                            <line x1="20" y1="0" x2="20" y2="40" stroke={colors.circuit} strokeWidth="1" opacity="0.3"/>
                            <line x1="10" y1="0" x2="10" y2="20" stroke={colors.circuit} strokeWidth="0.5" opacity="0.4"/>
                            <line x1="30" y1="20" x2="30" y2="40" stroke={colors.circuit} strokeWidth="0.5" opacity="0.4"/>
                            
                            {/* Circuit nodes/dots */}
                            <circle cx="20" cy="20" r="2" fill={colors.circuit} opacity="0.6"/>
                            <circle cx="10" cy="10" r="1" fill={colors.circuit} opacity="0.5"/>
                            <circle cx="30" cy="30" r="1" fill={colors.circuit} opacity="0.5"/>
                            <circle cx="0" cy="20" r="1" fill={colors.circuit} opacity="0.4"/>
                            <circle cx="40" cy="20" r="1" fill={colors.circuit} opacity="0.4"/>
                            <circle cx="20" cy="0" r="1" fill={colors.circuit} opacity="0.4"/>
                            <circle cx="20" cy="40" r="1" fill={colors.circuit} opacity="0.4"/>
                            
                            <rect x="18" y="8" width="4" height="2" fill={colors.circuit} opacity="0.3"/>
                            <rect x="28" y="18" width="2" height="4" fill={colors.circuit} opacity="0.3"/>
                            <rect x="8" y="28" width="4" height="2" fill={colors.circuit} opacity="0.3"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#circuit-${index})`}/>
                      </svg>
                    </div>

                    <div className="power-indicator">
                      <div className={`power-dot ${project.color}`}></div>
                      <span className={`power-text ${project.color}`}>ONLINE</span>
                    </div>

                    <div className="project-card-content">
                      <div>
                        <HexTextAnimation
                          text={project.title}
                          className={`h5 fw-bold ${colors.text} mb-3`}
                          delay={0.5}
                          duration={4}
                        />

                        <p>{project.description}</p>
                      </div>

                      <div className="cyber-btn-group mt-auto">
                        <Link href={project.github}>
                          <button className={`cyber-btn cyber-btn-${project.color}`}>
                           <i className="bi bi-github cyber-btn-icon fs-5"></i>
                          </button>
                        </Link>
                        <Link href={project.demo}>
                          <button className={`cyber-btn cyber-btn-${project.color}`}>
                            <i className="bi bi-box-arrow-up-right cyber-btn-icon fs-5"></i>
                          </button>
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
