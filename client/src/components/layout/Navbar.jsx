import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}><img src="./logo.jpeg" alt="" /></div>

      <nav className={styles.links}>
        <a>Home</a>
        <a>Matches</a>
        <a>Series</a>
        <a>Teams</a>
        <a>Players</a>
        <a>News</a>
      </nav>

      <div className={styles.actions}>
        <button className={styles.signIn}>Sign In</button>
        <button className={styles.getStarted}>Get Started</button>
      </div>
    </header>
  );
}