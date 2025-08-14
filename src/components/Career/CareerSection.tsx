"use client"
import HexTextAnimation from "../HexAnimation/HexAnimation"
import styles from "./Career.module.css"

const careers = [
  {
    id: 1,
    company: "Tesla",
    position: "Embedded Software Engineering Intern",
    duration: "January 2026 - April 2026",
    description:
      "Tesla updates software team. I contributed to the OTA firmware updates. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id ex vel odio dapibus mattis.",
    color: "red",
    logo: "T",
  },
  {
    id: 2,
    company: "Epic Games",
    position: "Software Engineering Intern",
    duration: "January 2026 - April 2026",
    description:
      "Tesla updates software team. I contributed to the OTA firmware updates. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id ex vel odio dapibus mattis.",
    color: "purple",
    logo: "EG",
  },
  {
    id: 3,
    company: "Jane Street",
    position: "Software Engineering Intern",
    duration: "January 2026 - April 2026",
    description:
      "Tesla updates software team. I contributed to the OTA firmware updates. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id ex vel odio dapibus mattis.",
    color: "yellow",
    logo: "JS",
  },
]

const colorClasses = {
  purple: {
    border: styles.borderPurple,
    bg: styles.bgPurpleDark,
    text: styles.textPurple,
    shadow: styles.shadowPurple,
    circuit: "#b347d9",
    subtle: styles.bgPurpleSubtle,
    card: styles.careerCardPurple
  },
  cyan: {
    border: styles.borderCyan,
    bg: styles.bgCyanDark,
    text: styles.textCyan,
    shadow: styles.shadowCyan,
    circuit: "#00d4ff",
    subtle: styles.bgCyanSubtle,
    card: styles.careerCardCyan
  },
  yellow: {
    border: styles.borderYellow,
    bg: styles.bgYellowDark,
    text: styles.textYellow,
    shadow: styles.shadowYellow,
    circuit: "#ffdd44",
    subtle: styles.bgYellowSubtle,
    card: styles.careerCardYellow
  },
  green: {
    border: styles.borderGreen,
    bg: styles.bgGreenDark,
    text: styles.textGreen,
    shadow: styles.shadowGreen,
    circuit: "#22c55e",
    subtle: styles.bgGreenSubtle,
    card: styles.careerCardGreen
  },
  red: {
    border: styles.borderRed,
    bg: styles.bgRedDark,
    text: styles.textRed,
    shadow: styles.shadowRed,
    circuit: "#ef4444",
    subtle: styles.bgRedSubtle,
    card: styles.careerCardRed
  },
  orange: {
    border: styles.borderOrange,
    bg: styles.bgOrangeDark,
    text: styles.textOrange,
    shadow: styles.shadowOrange,
    circuit: "#f97316",
    subtle: styles.bgOrangeSubtle,
    card: styles.careerCardOrange
  },
}

export default function CyberCareerStack() {
  return (
    <div className="container-fluid m-0 p-0 mt-3">
      <div className="row">
        <div className="col-12 w-100">
          <div className="position-relative">

            <div className="position-relative">
              {careers.map((career, index) => {
                const colors = colorClasses[career.color as keyof typeof colorClasses]
                return (
                  <div key={career.id} className={`position-relative ${styles.marginCard}`}>
                    <div
                      className={`position-relative p-0 ${styles.careerCard} ${colors.bg} ${colors.border} ${colors.shadow} ${colors.card} `}
                      data-augmented-ui="br-clip border"
                    >
                      <div className="d-flex">
                        <div
                          className={`flex-shrink-0 ${styles.borderPanel} ${colors.border} ${colors.subtle} position-relative`}
                          style={{
                            width: "32px",
                          }}
                        >
                          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0.5 }}>
                            <svg width="100%" height="100%">
                              <defs>
                                <pattern
                                  id={`screenPanel-${career.id}`}
                                  x="0"
                                  y="0"
                                  width="32"
                                  height="20"
                                  patternUnits="userSpaceOnUse"
                                >
                                  <line
                                    x1="16"
                                    y1="0"
                                    x2="16"
                                    y2="20"
                                    stroke={colors.circuit}
                                    strokeWidth="1"
                                    opacity="0.6"
                                  />
                                  <line
                                    x1="8"
                                    y1="0"
                                    x2="8"
                                    y2="10"
                                    stroke={colors.circuit}
                                    strokeWidth="0.5"
                                    opacity="0.4"
                                  />
                                  <line
                                    x1="24"
                                    y1="10"
                                    x2="24"
                                    y2="20"
                                    stroke={colors.circuit}
                                    strokeWidth="0.5"
                                    opacity="0.4"
                                  />

                                  <circle cx="16" cy="10" r="1.5" fill={colors.circuit} opacity="0.7" />
                                  <circle cx="8" cy="5" r="1" fill={colors.circuit} opacity="0.5" />
                                  <circle cx="24" cy="15" r="1" fill={colors.circuit} opacity="0.5" />


                                  <rect x="14" y="2" width="4" height="2" fill={colors.circuit} opacity="0.4" />
                                  <rect x="14" y="16" width="4" height="2" fill={colors.circuit} opacity="0.4" />
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill={`url(#screenPanel-${career.id})`} />
                            </svg>
                          </div>

                        </div>

                        {/* Main Screen Content Area */}
                        <div className="flex-fill p-4 position-relative">

                          {/* Content */}
                          <div className="d-flex align-items-start position-relative" style={{ zIndex: 10 }}>
                            {/* Company Terminal */}
                            <div
                              className={`border-2 ${colors.border} ${colors.bg} d-flex align-items-center justify-content-center fw-bold fs-2 flex-shrink-0 position-relative overflow-hidden me-4`}
                              style={{
                                width: "80px",
                                height: "80px",
                                color: colors.circuit,
                              }}
                            >
                              {career.logo}
                            </div>

                            <div className="flex-fill">
                              {/* Header */}
                              <div className="d-flex flex-column flex-lg-row align-items-lg-start justify-content-lg-between mb-3">
                                <div>
                                  <h3
                                    className={`h2 fw-bold mb-1 ${colors.text}`}
                                  >
                                    {career.company}
                                  </h3>
                                    <HexTextAnimation
                                        text={career.position}
                                        className={`fw-medium fs-5 mb-0 ${colors.text} fst-italic`}
                                        duration={2}
                                        delay={0.5}
                                    />
                                </div>
                                <div className="mt-2 mt-lg-0 text-lg-end">
                                    <HexTextAnimation text={career.duration} className={`${styles.durationText} ${colors.text}`} duration={2} delay={0.5} />
                                </div>
                              </div>

                              {/* Description */}
                              <p className="">{career.description}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
