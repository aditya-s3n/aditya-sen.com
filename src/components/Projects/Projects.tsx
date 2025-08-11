import styles from "./Projects.module.css";
import ProjectsSection from "./ProjectCard"

export default function Projects() {
  return (
    <div className="pt-5" id="projects">
        <h1 className={`${styles.projectColor}`}>Projects</h1>
        <div className={`w-100 border-top project-color ${styles.projectColor}`}></div>

        <ProjectsSection />
    </div>
  )
}
