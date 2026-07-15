import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>KubeSense</h1>

        <p className={styles.subtitle}>
          Ai-Powerder kubernetes troubleshooting assistant
        </p>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Project Ststus</h2>
          <p className={styles.text}>
            Frontend is running successfully.
          </p>
          <p className={styles.status}>
            Backend: not connected
          </p>
        </div>
      </div>
    </main>
  );
}
