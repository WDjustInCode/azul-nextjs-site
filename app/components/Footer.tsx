import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <Image
                src="/combination_mark_white.svg"
                alt="Azul"
                width={200}
                height={89}
                priority
                unoptimized
              />
            </div>
            <div className={styles.contactInfo}>
              <p>1223 Cleveland Ave. Ste 200-305</p>
              <p>San Antonio, TX 78203</p>
              <p>
                <a href="mailto:hello@azulpools.com">hello@azulpools.com</a>
              </p>
              <p>
                <a href="tel:18887687554">(888) 768-7554</a>
              </p>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.linkColumn}>
              <h3 className={styles.linkTitle}>QUICK LINKS</h3>
              <Link href="#quote">Get a Quote</Link>
              <Link href="#commercial">Commercial Pool Service</Link>
              <Link href="#services">Pool Services</Link>
              <Link href="#resources">Resources</Link>
              <Link href="#reviews">Reviews</Link>
            </div>

            <div className={styles.linkColumn}>
              <h3 className={styles.linkTitle}>MAINTENANCE SERVICES</h3>
              <Link href="#weekly-cleaning">Weekly Pool Cleaning</Link>
              <Link href="#filter-cleaning">Pool Filter Cleaning</Link>
              <Link href="#drain-restart">Pool Drain & Restart</Link>
              <Link href="#algae-removal">Pool Algae Removal</Link>
              <Link href="#hot-tub">Hot Tub Cleaning</Link>
              <Link href="#acid-wash">Pool Acid Washing</Link>
            </div>

            <div className={styles.linkColumn}>
              <h3 className={styles.linkTitle}>REPAIR SERVICES</h3>
              <Link href="#heater-repair">Pool Heater Repair</Link>
              <Link href="#pump-repair">Pool Pump Repair</Link>
              <Link href="#filter-repair">Pool Filter Repair</Link>
              <Link href="#light-repair">Pool Light Repair</Link>
              <Link href="#automation-repair">Pool Automation Repair</Link>
            </div>

            <div className={styles.linkColumn}>
              <h3 className={styles.linkTitle}>EQUIPMENT INSTALLS</h3>
              <Link href="#heater-install">Pool Heater Install</Link>
              <Link href="#pump-install">Pool Pump Install</Link>
              <Link href="#filter-install">Pool Filter Install</Link>
              <Link href="#automation-install">Pool Automation Install</Link>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>© 2025 Azul. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="#privacy">Privacy Policy</Link>
            <Link href="#terms">Terms of Use</Link>
            <Link href="#sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

