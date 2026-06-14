import styles from "../css/FeaturedMatchSection.module.css";

const filters = ["All", "Live", "Upcoming", "Completed", "International", "IPL", "T20I", "ODI", "Test"];

const updates = [
  ["45.2", "4", "FOUR!", "Beautiful shot through covers"],
  ["45.1", "1", "Single", "Pushed to mid on"],
  ["45.0", "W", "WICKET!", "M. Starc b Bumrah 23 (19)"],
  ["44.6", "6", "SIX!", "That's out of the ground!"],
  ["44.5", "1", "Single", "Tucked to leg side"],
];

export default function FeaturedMatchSection() {
  return (
    <section className={styles.desktopSection}>
      <div className={styles.filters}>
        {filters.map((item, index) => (
          <button key={item} className={index === 0 ? styles.active : ""}>
            {item}
          </button>
        ))}
      </div>

      <div className={styles.layout}>
        <div className={styles.matchCard}>
          <div className={styles.matchTop}>
            <div className={styles.meta}>
              <span className={styles.live}>● LIVE</span>
              <span>India vs Australia Series</span>
              <span className={styles.badge}>ODI</span>
              <span>3rd ODI</span>
              <span>Adelaide Oval</span>
            </div>
            <span>›</span>
          </div>

          <div className={styles.scoreRow}>
            <div className={styles.team}>
              <div className={styles.flag}>🇮🇳</div>
              <h3>IND</h3>
              <h2>278/6</h2>
              <p>(45.2 Overs)</p>
            </div>

            <div className={styles.center}>
              <span className={styles.vs}>VS</span>
              <p>India need 45 runs<br />in 28 balls</p>
            </div>

            <div className={styles.team}>
              <div className={styles.flag}>🇦🇺</div>
              <h3>AUS</h3>
              <h2>234/10</h2>
              <p>(49.3 Overs)</p>
            </div>
          </div>

          <div className={styles.progressText}>
            <span>India <b>68%</b></span>
            <span>Australia <b>32%</b></span>
          </div>

          <div className={styles.progress}>
            <div></div>
          </div>

          <div className={styles.cardBottom}>
            <span>CRR <b>6.13</b></span>
            <span>RRR <b>9.64</b></span>
            <span className={styles.lastOver}>
              Last Over
              <b>1</b><b>4</b><b>0</b><b className={styles.greenBall}>6</b><b>1</b><b>2</b>
            </span>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sideHeader}>
            <h3>Live Match Updates</h3>
            <button>View All</button>
          </div>

          {updates.map((item, index) => (
            <div className={styles.update} key={index}>
              <span>{item[0]}</span>
              <b className={item[1] === "W" ? styles.wicket : ""}>{item[1]}</b>
              <div>
                <h4>{item[2]}</h4>
                <p>{item[3]}</p>
              </div>
            </div>
          ))}

          <button className={styles.scorecard}>View Full Scorecard</button>
        </aside>
      </div>
    </section>
  );
}