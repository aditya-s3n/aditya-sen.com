import styles from "./Contact.module.css";

const socialLinks = [
  {
    name: "Email",
    icon: <i className="bi bi-envelope-fill"></i>,
    href: "mailto:aditya@example.com",
    color: "purple",
    description: "aditya@example.com",
  },
  {
    name: "LinkedIn",
    icon: <i className="bi bi-linkedin"></i>,
    href: "https://linkedin.com/in/adityasen",
    color: "cyan",
    description: "/in/adityasen",
  },
  {
    name: "GitHub",
    icon: <i className="bi bi-github"></i>,
    href: "https://github.com/adityasen",
    color: "orange",
    description: "@adityasen",
  },
  {
    name: "Twitter",
    icon: <i className="bi bi-twitter-x"></i>,
    href: "https://twitter.com/adityasen",
    color: "green",
    description: "@adityasen",
  },
];

const colorClasses = {
  orange: {
    circuit: "#f97316",
  },
  green: {
    circuit: "#34d399",
  },
  purple: {
    circuit: "#8b5cf6",
  },
  cyan: {
    circuit: "#22d3ee",
  },
};

export default function Contact() {
  return (
    <div className="pt-5">
      <h1 className={styles.contactColor}>Contact</h1>
      <div className={`w-100 border-top ${styles.contactColor} mb-3`}></div>

      <p className={`mt-5 text-center ${styles.contactText}`}>
        Reach out if you have any question, or just feeling friendly. <br />:)
      </p>

      <div className="row g-4 justify-content-center mb-5">
        {socialLinks.map((link, index) => {
          const colors = colorClasses[link.color as keyof typeof colorClasses];

          return (
            <div key={link.name} className="col-lg-3 col-md-6">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.contactCard} ${
                  styles[
                    `contactCard${
                      link.color.charAt(0).toUpperCase() + link.color.slice(1)
                    }`
                  ]
                } d-block text-decoration-none`}
              >
                {/* Pattern background */}
                <div className={styles.contactPattern}>
                  <svg
                    width="100%"
                    height="100%"
                    className="position-absolute top-0 start-0"
                  >
                    <defs>
                      <pattern
                        id={`contact-grid-${index}`}
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <rect
                          x="0"
                          y="0"
                          width="40"
                          height="40"
                          fill="none"
                          stroke={colors.circuit}
                          strokeWidth="0.5"
                          opacity="0.3"
                        />
                        <rect
                          x="5"
                          y="5"
                          width="30"
                          height="30"
                          fill="none"
                          stroke={colors.circuit}
                          strokeWidth="0.8"
                          opacity="0.4"
                        />
                        <rect
                          x="10"
                          y="10"
                          width="20"
                          height="20"
                          fill="none"
                          stroke={colors.circuit}
                          strokeWidth="1"
                          opacity="0.5"
                        />
                        <rect
                          x="0"
                          y="0"
                          width="8"
                          height="8"
                          fill="none"
                          stroke={colors.circuit}
                          strokeWidth="0.6"
                          opacity="0.4"
                        />
                        <rect
                          x="32"
                          y="0"
                          width="8"
                          height="8"
                          fill="none"
                          stroke={colors.circuit}
                          strokeWidth="0.6"
                          opacity="0.4"
                        />
                        <rect
                          x="0"
                          y="32"
                          width="8"
                          height="8"
                          fill="none"
                          stroke={colors.circuit}
                          strokeWidth="0.6"
                          opacity="0.4"
                        />
                        <rect
                          x="32"
                          y="32"
                          width="8"
                          height="8"
                          fill="none"
                          stroke={colors.circuit}
                          strokeWidth="0.6"
                          opacity="0.4"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="3"
                          fill="none"
                          stroke={colors.circuit}
                          strokeWidth="1"
                          opacity="0.6"
                        />
                        <circle
                          cx="20"
                          cy="20"
                          r="1"
                          fill={colors.circuit}
                          opacity="0.5"
                        />
                        <circle
                          cx="10"
                          cy="10"
                          r="0.8"
                          fill={colors.circuit}
                          opacity="0.4"
                        />
                        <circle
                          cx="30"
                          cy="10"
                          r="0.8"
                          fill={colors.circuit}
                          opacity="0.4"
                        />
                        <circle
                          cx="10"
                          cy="30"
                          r="0.8"
                          fill={colors.circuit}
                          opacity="0.4"
                        />
                        <circle
                          cx="30"
                          cy="30"
                          r="0.8"
                          fill={colors.circuit}
                          opacity="0.4"
                        />
                        <rect
                          x="18"
                          y="5"
                          width="4"
                          height="2"
                          fill={colors.circuit}
                          opacity="0.3"
                        />
                        <rect
                          x="18"
                          y="33"
                          width="4"
                          height="2"
                          fill={colors.circuit}
                          opacity="0.3"
                        />
                        <rect
                          x="5"
                          y="18"
                          width="2"
                          height="4"
                          fill={colors.circuit}
                          opacity="0.3"
                        />
                        <rect
                          x="33"
                          y="18"
                          width="2"
                          height="4"
                          fill={colors.circuit}
                          opacity="0.3"
                        />
                      </pattern>
                    </defs>
                    <rect
                      width="100%"
                      height="100%"
                      fill={`url(#contact-grid-${index})`}
                    />
                  </svg>
                </div>

                {/* Dataflow animations */}
                <div className={styles.contactDataflow}>
                  <div
                    className={styles.dataflowStream}
                    style={{
                      top: "25%",
                      background: `linear-gradient(90deg, transparent, ${colors.circuit}, transparent)`,
                      boxShadow: `0 0 2px ${colors.circuit}`,
                      animationDuration: "4s",
                    }}
                  />
                  <div
                    className={styles.dataflowStream}
                    style={{
                      top: "50%",
                      background: `linear-gradient(90deg, transparent, ${colors.circuit}, transparent)`,
                      boxShadow: `0 0 2px ${colors.circuit}`,
                      animationDuration: "5s",
                      animationDelay: "1s",
                    }}
                  />
                  <div
                    className={styles.dataflowStream}
                    style={{
                      top: "75%",
                      background: `linear-gradient(90deg, transparent, ${colors.circuit}, transparent)`,
                      boxShadow: `0 0 2px ${colors.circuit}`,
                      animationDuration: "4.5s",
                      animationDelay: "2s",
                    }}
                  />
                </div>

                {/* Card content */}
                <div className={styles.contactContent}>
                {link.icon}
                  <h3 className={styles.contactName}>{link.name}</h3>
                  <p className={styles.contactDescription}>
                    {link.description}
                  </p>
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
