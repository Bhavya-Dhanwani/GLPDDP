import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa6";
import styles from "../css/Footer.module.css";
import buttonStyles from "@/features/shared/ui/css/Button.module.css";
import logo from "@/assets/images/logo.png";

const footerSections = [
  {
    title: "EXPLORE",
    links: [
      { href: "/matches", label: "Matches" },
      { href: "/series", label: "Series" },
      { href: "/teams", label: "Teams" },
      { href: "/players", label: "Players" },
    ],
  },
  {
    title: "ACCOUNT",
    links: [
      { href: "/login", label: "Login" },
      { href: "/signup", label: "Sign Up" },
      { href: "/forgot-password", label: "Forgot Password" },
      { href: "/verify-email", label: "Verify Email" },
    ],
  },
  {
    title: "MORE",
    links: [
      { href: "/", label: "Home" },
      { href: "/matches", label: "Live Matches" },
      { href: "/teams", label: "Browse Teams" },
      { href: "/players", label: "Browse Players" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.ctaBanner}>
        <div>
          <h2>Never Miss a Moment</h2>
          <p>
            Get real-time updates, scores and commentary
            right at your fingertips.
          </p>
        </div>

        <Link href="/login" className={`${buttonStyles.secondary} ${styles.ctaLink}`}>
          Join Now - It&apos;s Free →
        </Link>
      </div>

      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <h2><Image src={logo} alt="Logo" width={100} /></h2>
          <p>Live Cricket. Real Time.</p>

          <div className={styles.socials}>
            <span>{<FaFacebook size={20} />}</span>
            <span>{<FaTwitter size={20} />}</span>
            <span>{<FaInstagram size={20} />}</span>
            <span>{<FaYoutube size={20} />}</span>
          </div>
        </div>

        {footerSections.map((section) => (
          <div key={section.title}>
            <h4>{section.title}</h4>
            <ul>
              {section.links.map((link) => (
                <li key={`${section.title}-${link.href}`}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        © 2026 GLPDDP. All rights reserved.
      </div>
    </footer>
  );
}
