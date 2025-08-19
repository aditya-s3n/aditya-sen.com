"use client"

import HexTextAnimation from "../HexAnimation/HexAnimation"
import Image from "next/image";
import styles from "./Career.module.css"

import midnightSunLogo from "@/imgs/MidnightSun.png";
import dundasLifeLogo from "@/imgs/DundasLife.png";
import lifestyleLogo from "@/imgs/Lifestyle.png";
import uCastLogo from "@/imgs/uCastLogo.png";

const careers = [
  {
    id: 1,
    company: "Midnight Sun Solar Rayce XVI",
    position: "Firmware Team Lead",
    duration: "January 2024 - Present",
    description:
      "Engineered multiple firmware components for the car, including a FOTA-enabled CAN bootloader and current-sense drivers for the pedals. Of course, guided team members, as well as reviewed PR's for the firmware repository.",
    color: "orange",
    logo: midnightSunLogo,
  },
  {
    id: 2,
    company: "Lifestyle Home Products",
    position: "Software Engineering Intern",
    duration: "May 2025 - August 2025",
    description:
      "Independently, built out a custom rules engine for the main sales team. The rules engine ranked sales representatives and appointments. Personally built the rank match algorithm to run daily, assigning appointments to sales representatives.",
    color: "red",
    logo: lifestyleLogo,
  },
  {
    id: 3,
    company: "Lifestyle Home Products",
    position: "Software Engineering Intern",
    duration: "September 2024 - December 2024",
    description:
      "Developed API integrations for EXP Realty’s KVcore platform using Google Cloud and Node.js, and built a Python-based OpenAI transcript analysis AI to evaluate dialer conversations and assess lead quality. ",
    color: "red",
    logo: lifestyleLogo,
  },
  {
    id: 4,
    company: "Dundas Life",
    position: "Software Engineering Intern",
    duration: "January 2024 - April 2024",
    description:
      "Governed and trained an underwriting assistant AI, using Open AI API and Postman, resulting in an AI chat assistant that can analyze PDF's of various insurance providers and provide insight on client's approval and premium rate.",
    color: "green",
    logo: dundasLifeLogo,
  },
  {
    id: 5,
    company: "uCast",
    position: "Software Engineering Intern",
    duration: "July 2022 - July 2023",
    description:
      "Built an internal wallet currency system end-to-end, integrating AWS and Stripe to convert user payments into in-app credits. Fixed various bugs throughout the application, notably helping optimize the rank algorithm for the in-built search engine.",
    color: "purple",
    logo: uCastLogo,
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
              {careers.map((career) => {
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

                        <div className="flex-fill p-4 position-relative">

                          <div className="d-flex align-items-start position-relative" style={{ zIndex: 10 }}>
                            <div
                              className={`border-2 ${colors.border} ${colors.bg} d-flex align-items-center justify-content-center fw-bold fs-2 flex-shrink-0 position-relative overflow-hidden me-4`}
                              style={{
                                width: "80px",
                                height: "80px",
                                color: colors.circuit,
                              }}
                            >
                              <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                                <Image
                                  src={career.logo}
                                  alt={career.company}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  priority
                                />
                              </div>
                            </div>

                            <div className="flex-fill">
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
