import styles from "./lava-lamp-background.module.scss";

export function LavaLampBackground() {
  return (
    <div className={styles.lava} aria-hidden>
      <span className={`${styles.blob} ${styles.blobOne}`} />
      <span className={`${styles.blob} ${styles.blobTwo}`} />
      <span className={`${styles.blob} ${styles.blobThree}`} />
      <span className={`${styles.blob} ${styles.blobFour}`} />
      <span className={`${styles.blob} ${styles.blobFive}`} />
    </div>
  );
}
