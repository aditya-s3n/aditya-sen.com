import HexTextAnimation from "../HexAnimation/HexAnimation";
import styles from "./Contact.module.css";

const socialLinks = [
  {
    name: "Email",
    icon: <i className="bi fs-1 bi-envelope-fill"></i>,
    href: "mailto:adityasen120@gmail.com",
    color: "purple",
    description: "adityasen120@gmail.com",
  },
  {
    name: "LinkedIn",
    icon: <i className="bi fs-1 bi-linkedin"></i>,
    href: "https://www.linkedin.com/in/aditya-s3n/",
    color: "cyan",
    description: "/in/aditya-s3n",
  },
  {
    name: "GitHub",
    icon: <i className="bi fs-1 bi-github"></i>,
    href: "https://github.com/aditya-s3n",
    color: "orange",
    description: "@aditya-s3n",
  },
  {
    name: "Twitter",
    icon: <i className="bi fs-1 bi-twitter-x"></i>,
    href: "https://x.com/AdityaS3n",
    color: "green",
    description: "@AdityaS3n",
  },
];

export default function Contact() {
  return (
    <div className="pt-5">
      <h1 className={styles.contactColor}>Contact</h1>
      <div className={`w-100 border-top ${styles.contactColor} mb-3`}></div>

      <p className={`mt-5 text-center fs-4 ${styles.contactText}`}>
        Reach out if you have any questions, or just feeling friendly. <br />:)
      </p>

      <div className="row g-4 justify-content-center mb-5 mt-3">
        {socialLinks.map((link) => {

          return (
            <div key={link.name} className="col-lg-3 col-md-6 mb-5">
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
                data-augmented-ui="b-clip-x tr-2-clip-x tl-2-clip-x border"
              >

                <div className={`text-center h-100 w-100 ${styles.contactContent} ${styles.contactName}`}>
                  {link.icon}
                  <h3 className={styles.contactName}>{link.name}</h3>

                  <HexTextAnimation
                    text={link.description}
                    className={styles.contactDescription}
                    delay={0.5}
                    duration={2}
                  />
                </div>
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
