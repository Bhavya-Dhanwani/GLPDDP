import styles from "./Footer.module.css";
import {
  FaApple,
  FaGooglePlay,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* CTA Banner */}
      <div className={styles.ctaBanner}>
        <div>
          <h2>Never Miss a Moment</h2>
          <p>
            Get real-time updates, scores and commentary
            right at your fingertips.
          </p>
        </div>

        <button className={styles.ctaButton}>
          Join Now — It's Free →
        </button>
      </div>

      {/* Footer Content */}
      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <h2><img src="/logo.jpeg" alt="" /></h2>
          <p>Live Cricket. Real Time.</p>

          <div className={styles.socials}>
            <span>{<FaFacebook size={20} />}</span>
            <span>{<FaTwitter size={20} />}</span>
            <span>{<FaInstagram size={20} />}</span>
            <span>{<FaYoutube size={20} />}</span>
          </div>
        </div>

        <div>
          <h4>COMPANY</h4>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div>
          <h4>SUPPORT</h4>
          <ul>
            <li>Help Center</li>
            <li>FAQs</li>
            <li>Feedback</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        <div>
          <h4>QUICK LINKS</h4>
          <ul>
            <li>Matches</li>
            <li>Series</li>
            <li>Teams</li>
            <li>Players</li>
          </ul>
        </div>

        <div>
          <h4>GET THE APP</h4>
          <p className={styles.coming}>Coming Soon</p>

          <div className={styles.appButtons}>
            <button>{<FaApple size={20} />}  App Store</button>
            <button>{<FaGooglePlay size={20} />}   Google Play</button>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        © 2026 GLPDDP. All rights reserved.
      </div>
    </footer>
  );
}