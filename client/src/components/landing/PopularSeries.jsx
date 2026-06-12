import styles from "./PopularSeries.module.css";

const seriesList = [
  {
    title: "ICC Champions Trophy 2025",
    matches: "5 Matches",
    status: "LIVE",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
  },
  {
    title: "India Tour of England 2025",
    matches: "5 Tests • 3 ODIs • 5 T20Is",
    status: "UPCOMING",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
  },
  {
    title: "Big Bash League 2024",
    matches: "32 Matches",
    status: "LIVE",
    image: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972",
  },
  {
    title: "Asia Cup 2025",
    matches: "13 Matches",
    status: "UPCOMING",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
  },
];

export default function PopularSeries() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.label}>POPULAR SERIES</p>
          <h2>Follow Your Favorite Series</h2>
        </div>

        <button className={styles.viewButton}>View All Series →</button>
      </div>

      <div className={styles.cards}>
        {seriesList.map((item, index) => (
          <div className={styles.card} key={index}>
            <div className={styles.imageBox}>
              <img src={item.image} alt={item.title} />
              <span
                className={
                  item.status === "LIVE"
                    ? styles.liveBadge
                    : styles.upcomingBadge
                }
              >
                {item.status}
              </span>
            </div>

            <div className={styles.content}>
              <h3>{item.title}</h3>
              <p>{item.matches}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}