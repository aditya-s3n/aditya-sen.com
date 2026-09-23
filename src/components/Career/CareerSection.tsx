"use client"

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import HexTextAnimation from "../HexAnimation/HexAnimation"
import styles from "./Career.module.css"

import spsCommerceLogo from "@/imgs/SPSCommerce.png";
import midnightSunLogo from "@/imgs/MidnightSun.png";
import dundasLifeLogo from "@/imgs/DundasLife.png";
import lifestyleLogo from "@/imgs/Lifestyle.png";
import uCastLogo from "@/imgs/uCastLogo.png";


export type CareerEntry = {
  id: number
  company: string
  position: string
  duration: string
  description: string
  color: string
  logo: StaticImageData
}

export const careers: CareerEntry[] = [
  {
    id: 0,
    company: "SPS Commerce",
    position: "Software Engineering Intern",
    duration: "January 2026 - April 2026",
    description:
      "Engineered a new external API service in Python and Kotlin to centralize external reference values across the SPS platform, and wrote Kotlin migration scripts to update 10,000+ database records.",
    color: "#00d4ff",
    logo: spsCommerceLogo,
  },
  {
    id: 1,
    company: "Midnight Sun Solar Rayce XVI",
    position: "Firmware Team Lead",
    duration: "January 2024 - January 2026",
    description:
      "Engineered multiple firmware components for the car, including a FOTA-enabled CAN bootloader and current-sense drivers for the pedals. Of course, guided team members, as well as reviewed PR's for the firmware repository.",
    color: "#f97316",
    logo: midnightSunLogo,
  },
  {
    id: 2,
    company: "Lifestyle Home Products",
    position: "Software Engineering Intern",
    duration: "May 2025 - August 2025",
    description:
      "Independently, built out a custom rules engine for the main sales team. The rules engine ranked sales representatives and appointments. Personally built the rank match algorithm to run daily, assigning appointments to sales representatives.",
    color: "#ef4444",
    logo: lifestyleLogo,
  },
  {
    id: 3,
    company: "Lifestyle Home Products",
    position: "Software Engineering Intern",
    duration: "September 2024 - December 2024",
    description:
      "Developed API integrations for EXP Realty’s KVcore platform using Google Cloud and Node.js, and built a Python-based OpenAI transcript analysis AI to evaluate dialer conversations and assess lead quality. ",
    color: "#ef4444",
    logo: lifestyleLogo,
  },
  {
    id: 4,
    company: "Dundas Life",
    position: "Software Engineering Intern",
    duration: "January 2024 - April 2024",
    description:
      "Governed and trained an underwriting assistant AI, using Open AI API and Postman, resulting in an AI chat assistant that can analyze PDF's of various insurance providers and provide insight on client's approval and premium rate.",
    color: "#22c55e",
    logo: dundasLifeLogo,
  },
  {
    id: 5,
    company: "uCast",
    position: "Software Engineering Intern",
    duration: "July 2022 - July 2023",
    description:
      "Built an internal wallet currency system end-to-end, integrating AWS and Stripe to convert user payments into in-app credits. Fixed various bugs throughout the application, notably helping optimize the rank algorithm for the in-built search engine.",
    color: "#b347d9",
    logo: uCastLogo,
  },
]

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

// "January 2026 - April 2026" -> 4 (inclusive month count), shown as the stick's "capacity"
export function durationInMonths(duration: string) {
  const [start, end] = duration.split(" - ").map((part) => {
    const [month, year] = part.trim().split(" ")
    return Number(year) * 12 + MONTHS.indexOf(month)
  })
  return end - start + 1
}

// Short part number printed on the stick's label, e.g. "SPS-SWE-2026"
function partNumber(career: CareerEntry) {
  const vendor = career.company.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 3)
  const role = career.position.split(" ").map((word) => word[0]).join("").toUpperCase().slice(0, 3)
  const year = career.duration.split(" - ")[0].split(" ")[1]
  return `${vendor}-${role}-${year}`
}

function GoldFingers() {
  return (
    <div className={styles.fingers} aria-hidden="true">
      <div className={styles.pins} style={{ flex: 58 }} />
      <div className={styles.keyNotch} />
      <div className={styles.pins} style={{ flex: 42 }} />
    </div>
  )
}

export default function CareerSection() {
  return (
    <div className="d-flex flex-column gap-5 mt-4">
      {careers.map((career, index) => (
        <motion.article
          key={career.id}
          className={styles.stick}
          style={{ "--accent": career.color } as React.CSSProperties}
          data-augmented-ui="l-round-xy r-round-xy bl-clip br-clip border"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.rgbBar} aria-hidden="true" />

          <div className={styles.spreader} data-augmented-ui="tr-clip bl-clip border">
            <div className={styles.spreaderMeta}>
              <span>DIMM_0{index}</span>
              <span className="d-none d-sm-inline">PN {partNumber(career)}</span>
              <span>{durationInMonths(career.duration)} MO</span>
            </div>

            <div className={styles.spreaderBody}>
              <div className={styles.logoChip}>
                <Image src={career.logo} alt={career.company} className={styles.logoImage} sizes="64px" />
              </div>

              <div className={styles.label}>
                <div className="d-flex flex-column flex-lg-row justify-content-lg-between gap-1 mb-2">
                  <h3 className={styles.company}>{career.company}</h3>
                  <span className={styles.duration}>{career.duration}</span>
                </div>
                <HexTextAnimation
                  text={career.position}
                  className={`fs-6 mb-2 fst-italic ${styles.position}`}
                  duration={1.5}
                  delay={0.3}
                />
                <p className={styles.description}>{career.description}</p>
              </div>
            </div>
          </div>

          <div className={styles.pcbStrip} aria-hidden="true">
            {Array.from({ length: 8 }, (_, i) => <span key={i} className={styles.smd} />)}
          </div>

          <GoldFingers />
        </motion.article>
      ))}
    </div>
  )
}
