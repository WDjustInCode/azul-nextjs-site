"use client";

import styles from "./BackButton.module.css";

interface Props {
  onClick: () => void;
  label?: string;
}

export function BackButton({ onClick, label = "Back" }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.backButton}
    >
      <svg
        className={styles.backIcon}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {label}
    </button>
  );
}

