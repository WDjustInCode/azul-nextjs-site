import styles from './ServicesSection.module.css';

export default function ServicesSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Service you can count on</h2>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.imageWrapper}>
            <img src="https://img1.wsimg.com/isteam/ip/6f7e54c6-a72a-4a50-a1f0-7c28226198af/Image%20Nov%2023%2C%202025%20at%2007_51_10%20PM-89b5521.png/:/rs=w:740,cg:true,m" alt="Routine Care" />
          </div>
          <h3>Routine Care</h3>
          <p>We balance chemistry, brush tiles, skim surfaces, and empty baskets for crystal-clear water.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.imageWrapper}>
            <img src="https://img1.wsimg.com/isteam/ip/6f7e54c6-a72a-4a50-a1f0-7c28226198af/Image%20Nov%2023%2C%202025%20at%2007_51_03%20PM-90b7198.png/:/rs=w:740,cg:true,m" alt="Equipment Repair" />
          </div>
          <h3>Equipment Repair</h3>
          <p>We diagnose and repair pumps, heaters, filters, and automation to keep your pool running smoothly.</p>
        </div>

        <div className={styles.card}>
          <div className={styles.imageWrapper}>
            <img src="https://img1.wsimg.com/isteam/ip/6f7e54c6-a72a-4a50-a1f0-7c28226198af/Image%20Nov%2023%2C%202025%20at%2007_51_06%20PM-df5c8a1.png/:/rs=w:740,cg:true,m" alt="Filter Cleaning" />
          </div>
          <h3>Filter Cleaning</h3>
          <p>We deep-clean filters to improve circulation, extend equipment life, and maintain crystal-clear water.</p>
        </div>
      </div>
    </section>
  );
}

