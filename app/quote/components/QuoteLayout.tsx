import { ReactNode } from "react";
import Link from "next/link";
import styles from "./QuoteLayout.module.css";

export default function QuoteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      {/* Top bar with phone, etc. */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.logo}>
            <img src="/logo_mark_dark.svg" alt="Azul logo" className={styles.logoImage} />
          </Link>
          <a
            href="tel:1210-414-4771"
            className={styles.phone}
          >
            (210) 414-4771
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

