import "./Projects.css"
import ProjectsSection from "./ProjectCard"

export default function Projects() {
  return (
    <div className="pt-5" id="projects">
        <h1 className="project-color">Projects</h1>
        <div className="w-100 border-top project-color"></div>

        <ProjectsSection />
    </div>
  )
}
