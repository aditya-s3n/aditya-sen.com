import HexTextAnimation from "../HexAnimation/HexAnimation";
import styles from "./Contact.module.css";

const socialLinks = [
  {
    name: "Email",
    icon: "bi-envelope-fill",
    href: "mailto:adityasen120@gmail.com",
    color: "#8b5cf6",
    file: "~/contact/email.sh",
    command: "mail --to",
    output: "adityasen120@gmail.com",
    action: "SEND MAIL",
  },
  {
    name: "LinkedIn",
    icon: "bi-linkedin",
    href: "https://www.linkedin.com/in/aditya-s3n/",
    color: "#22d3ee",
    file: "~/contact/linkedin.sh",
    command: "curl linkedin.com",
    output: "/in/aditya-s3n",
    action: "CONNECT",
  },
  {
    name: "GitHub",
    icon: "bi-github",
    href: "https://github.com/aditya-s3n",
    color: "#f97316",
    file: "~/contact/github.sh",
    command: "git remote -v",
    output: "@aditya-s3n",
    action: "VIEW REPOS",
  },
  {
    name: "Twitter",
    icon: "bi-twitter-x",
    href: "https://x.com/AdityaS3n",
    color: "#34d399",
    file: "~/contact/x.sh",
    command: "tail -f x.com",
    output: "@AdityaS3n",
    action: "FOLLOW",
  },
];

export default function Contact() {
  return (
    <section className="pt-5">
      <div className={styles.header}>
        <span className={styles.headerIndex}>{"// 04"}</span>
        <HexTextAnimation className={`mb-0 ${styles.headerTitle}`} text="CONTACT" duration={1} />
        <div className={styles.headerLine} />
      </div>

      <div className={styles.transmission} data-augmented-ui="tl-clip br-clip border">
        <span className={styles.signal} aria-hidden="true">
          <i /><i /><i /><i />
        </span>
        <div>
          <p className={styles.transmissionLabel}>OPEN CHANNEL</p>
          <p className={styles.transmissionText}>
            Reach out if you have any questions, or just feeling friendly. :)
          </p>
        </div>
      </div>

      <div className={styles.terminalGrid}>
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.terminal}
            style={{ "--accent": link.color } as React.CSSProperties}
            data-augmented-ui="tr-clip bl-clip border"
          >
            <div className={styles.terminalBar}>
              <span className={styles.terminalDots} aria-hidden="true"><i /><i /><i /></span>
              <span className={styles.terminalPath}>{link.file}</span>
              <i className={`bi ${link.icon} ${styles.barIcon}`} aria-hidden="true" />
            </div>

            <div className={styles.terminalBody}>
              <p className={styles.line}>
                <span className={styles.user}>guest@aditya</span>
                <span className={styles.dim}>:~$</span> {link.command}
              </p>
              <div className={styles.output}>
                <i className={`bi ${link.icon} ${styles.outputIcon}`} aria-hidden="true" />
                <div style={{ minWidth: 0 }}>
                  <p className={styles.outputName}>{link.name}</p>
                  <HexTextAnimation
                    text={link.output}
                    className={styles.outputValue}
                    delay={0.4}
                    duration={1.5}
                  />
                </div>
              </div>
              <p className={`${styles.line} mb-0`}>
                <span className={styles.user}>guest@aditya</span>
                <span className={styles.dim}>:~$</span>{" "}
                <span className={styles.action}>
                  [ {link.action} <i className="bi bi-arrow-up-right" /> ]
                </span>
                <span className={styles.caret} aria-hidden="true" />
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
